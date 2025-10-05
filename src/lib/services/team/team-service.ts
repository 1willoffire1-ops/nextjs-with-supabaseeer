import { supabaseAdmin } from '@/lib/supabase/server'
import crypto from 'crypto'

export type TeamRole = 'admin' | 'user' | 'viewer'
export type MemberStatus = 'pending' | 'active' | 'suspended'

export interface TeamMember {
  id: string
  companyId: string
  userId?: string
  email: string
  role: TeamRole
  invitedBy: string
  invitedAt: string
  acceptedAt?: string
  status: MemberStatus
  permissions: {
    canFix: boolean
    canUpload: boolean
    canExport: boolean
    canInvite: boolean
  }
  lastActive?: string
  createdAt: string
}

export interface TeamInvitation {
  id: string
  companyId: string
  email: string
  role: TeamRole
  invitedBy: string
  token: string
  expiresAt: string
  accepted: boolean
  createdAt: string
}

export interface ActivityLogEntry {
  id: string
  companyId: string
  userId: string
  action: string
  resourceType?: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export class TeamService {
  /**
   * Invite a new team member
   */
  async inviteTeamMember(
    companyId: string,
    email: string,
    role: TeamRole,
    invitedBy: string
  ): Promise<{ success: boolean; invitation?: TeamInvitation; error?: string }> {
    try {
      // Check if user already exists in team
      const { data: existing } = await supabaseAdmin
        .from('team_members')
        .select('id')
        .eq('company_id', companyId)
        .eq('email', email)
        .single()

      if (existing) {
        return {
          success: false,
          error: 'User is already a member of this team'
        }
      }

      // Generate unique invitation token
      const token = crypto.randomBytes(32).toString('hex')
      
      // Set expiration to 7 days from now
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      // Create invitation
      const { data: invitation, error } = await supabaseAdmin
        .from('team_invitations')
        .insert({
          company_id: companyId,
          email,
          role,
          invited_by: invitedBy,
          token,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await this.logActivity({
        companyId,
        userId: invitedBy,
        action: 'team_member_invited',
        resourceType: 'invitation',
        resourceId: invitation.id,
        details: { email, role }
      })

      return { success: true, invitation }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Accept a team invitation
   */
  async acceptInvitation(
    token: string,
    userId: string
  ): Promise<{ success: boolean; member?: TeamMember; error?: string }> {
    try {
      // Find invitation
      const { data: invitation } = await supabaseAdmin
        .from('team_invitations')
        .select('*')
        .eq('token', token)
        .eq('accepted', false)
        .single()

      if (!invitation) {
        return { success: false, error: 'Invalid or expired invitation' }
      }

      // Check if expired
      if (new Date(invitation.expires_at) < new Date()) {
        return { success: false, error: 'Invitation has expired' }
      }

      // Get user email
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('id', userId)
        .single()

      if (!user || user.email !== invitation.email) {
        return { success: false, error: 'Email mismatch' }
      }

      // Create team member
      const { data: member, error: memberError } = await supabaseAdmin
        .from('team_members')
        .insert({
          company_id: invitation.company_id,
          user_id: userId,
          email: invitation.email,
          role: invitation.role,
          invited_by: invitation.invited_by,
          invited_at: invitation.created_at,
          accepted_at: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single()

      if (memberError) {
        return { success: false, error: memberError.message }
      }

      // Mark invitation as accepted
      await supabaseAdmin
        .from('team_invitations')
        .update({ accepted: true })
        .eq('id', invitation.id)

      // Log activity
      await this.logActivity({
        companyId: invitation.company_id,
        userId,
        action: 'team_member_joined',
        resourceType: 'team_member',
        resourceId: member.id,
        details: { role: invitation.role }
      })

      return { success: true, member }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Get team members for a company
   */
  async getTeamMembers(companyId: string): Promise<TeamMember[]> {
    const { data } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    return data || []
  }

  /**
   * Update team member role
   */
  async updateMemberRole(
    memberId: string,
    newRole: TeamRole,
    updatedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: member, error } = await supabaseAdmin
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await this.logActivity({
        companyId: member.company_id,
        userId: updatedBy,
        action: 'team_member_role_updated',
        resourceType: 'team_member',
        resourceId: memberId,
        details: { newRole, email: member.email }
      })

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Update team member permissions
   */
  async updateMemberPermissions(
    memberId: string,
    permissions: Partial<TeamMember['permissions']>,
    updatedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: member } = await supabaseAdmin
        .from('team_members')
        .select('permissions, company_id')
        .eq('id', memberId)
        .single()

      if (!member) {
        return { success: false, error: 'Member not found' }
      }

      const updatedPermissions = { ...member.permissions, ...permissions }

      const { error } = await supabaseAdmin
        .from('team_members')
        .update({ permissions: updatedPermissions })
        .eq('id', memberId)

      if (error) {
        return { success: false, error: error.message }
      }

      // Log activity
      await this.logActivity({
        companyId: member.company_id,
        userId: updatedBy,
        action: 'team_member_permissions_updated',
        resourceType: 'team_member',
        resourceId: memberId,
        details: { permissions: updatedPermissions }
      })

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Suspend team member
   */
  async suspendMember(
    memberId: string,
    suspendedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: member, error } = await supabaseAdmin
        .from('team_members')
        .update({ status: 'suspended' })
        .eq('id', memberId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      await this.logActivity({
        companyId: member.company_id,
        userId: suspendedBy,
        action: 'team_member_suspended',
        resourceType: 'team_member',
        resourceId: memberId,
        details: { email: member.email }
      })

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Remove team member
   */
  async removeMember(
    memberId: string,
    removedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: member } = await supabaseAdmin
        .from('team_members')
        .select('company_id, email')
        .eq('id', memberId)
        .single()

      if (!member) {
        return { success: false, error: 'Member not found' }
      }

      const { error } = await supabaseAdmin
        .from('team_members')
        .delete()
        .eq('id', memberId)

      if (error) {
        return { success: false, error: error.message }
      }

      await this.logActivity({
        companyId: member.company_id,
        userId: removedBy,
        action: 'team_member_removed',
        resourceType: 'team_member',
        resourceId: memberId,
        details: { email: member.email }
      })

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Check if user has permission
   */
  async hasPermission(
    userId: string,
    permission: keyof TeamMember['permissions']
  ): Promise<boolean> {
    const { data: member } = await supabaseAdmin
      .from('team_members')
      .select('permissions, role, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (!member) return false

    // Admins have all permissions
    if (member.role === 'admin') return true

    return member.permissions[permission] === true
  }

  /**
   * Get activity log
   */
  async getActivityLog(
    companyId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<ActivityLogEntry[]> {
    const { data } = await supabaseAdmin
      .from('activity_log')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return data || []
  }

  /**
   * Log activity
   */
  async logActivity(params: {
    companyId: string
    userId: string
    action: string
    resourceType?: string
    resourceId?: string
    details?: Record<string, any>
    ipAddress?: string
    userAgent?: string
  }): Promise<void> {
    await supabaseAdmin
      .from('activity_log')
      .insert({
        company_id: params.companyId,
        user_id: params.userId,
        action: params.action,
        resource_type: params.resourceType,
        resource_id: params.resourceId,
        details: params.details,
        ip_address: params.ipAddress,
        user_agent: params.userAgent
      })
  }

  /**
   * Get pending invitations
   */
  async getPendingInvitations(companyId: string): Promise<TeamInvitation[]> {
    const { data } = await supabaseAdmin
      .from('team_invitations')
      .select('*')
      .eq('company_id', companyId)
      .eq('accepted', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    return data || []
  }

  /**
   * Resend invitation
   */
  async resendInvitation(invitationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Extend expiration by 7 days
      const newExpiresAt = new Date()
      newExpiresAt.setDate(newExpiresAt.getDate() + 7)

      const { error } = await supabaseAdmin
        .from('team_invitations')
        .update({ expires_at: newExpiresAt.toISOString() })
        .eq('id', invitationId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Cancel invitation
   */
  async cancelInvitation(
    invitationId: string,
    cancelledBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: invitation } = await supabaseAdmin
        .from('team_invitations')
        .select('company_id, email')
        .eq('id', invitationId)
        .single()

      if (!invitation) {
        return { success: false, error: 'Invitation not found' }
      }

      const { error } = await supabaseAdmin
        .from('team_invitations')
        .delete()
        .eq('id', invitationId)

      if (error) {
        return { success: false, error: error.message }
      }

      await this.logActivity({
        companyId: invitation.company_id,
        userId: cancelledBy,
        action: 'invitation_cancelled',
        resourceType: 'invitation',
        resourceId: invitationId,
        details: { email: invitation.email }
      })

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

export const teamService = new TeamService()
