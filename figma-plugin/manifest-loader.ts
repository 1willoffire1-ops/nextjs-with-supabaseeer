// Manifest Loader Utility
// Reads JSON manifest files and parses them for Figma page generation

import landingManifest from './manifests/landing-page-manifest.json';
import dashboardManifest from './manifests/dashboard-manifest.json';

// Type definitions for manifest structure
interface ManifestColor {
  r: number;
  g: number;
  b: number;
}

interface ManifestSection {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

interface Manifest {
  page_type: string;
  page_name: string;
  version: string;
  framework: string;
  styling: string;
  description: string;
  design_system: {
    theme: string;
    colors: any;
    typography: any;
    spacing: any;
  };
  sections: ManifestSection[];
  [key: string]: any;
}

// Convert hex color to Figma RGB
function hexToRgb(hex: string): ManifestColor {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  } : { r: 0, g: 0, b: 0 };
}

// Manifest Loader Class
class ManifestLoader {
  private manifests: Map<string, Manifest>;

  constructor() {
    this.manifests = new Map();
    this.loadManifests();
  }

  private loadManifests() {
    // Load all available manifests
    this.manifests.set('landing', landingManifest as Manifest);
    this.manifests.set('dashboard', dashboardManifest as Manifest);
  }

  getManifest(pageType: string): Manifest | null {
    return this.manifests.get(pageType) || null;
  }

  getAllManifests(): Manifest[] {
    return Array.from(this.manifests.values());
  }

  getPageTypes(): string[] {
    return Array.from(this.manifests.keys());
  }

  // Parse colors from manifest
  parseColors(manifest: Manifest): Map<string, ManifestColor> {
    const colors = new Map<string, ManifestColor>();
    const designSystem = manifest.design_system;

    if (designSystem?.colors) {
      // Parse primary colors
      if (designSystem.colors.primary) {
        colors.set('primary', hexToRgb(designSystem.colors.primary));
      }
      if (designSystem.colors.secondary) {
        colors.set('secondary', hexToRgb(designSystem.colors.secondary));
      }

      // Parse background colors
      if (designSystem.colors.background) {
        Object.entries(designSystem.colors.background).forEach(([key, value]) => {
          if (typeof value === 'string' && value.startsWith('#')) {
            colors.set(`bg_${key}`, hexToRgb(value));
          }
        });
      }

      // Parse status colors
      if (designSystem.colors.status) {
        Object.entries(designSystem.colors.status).forEach(([key, value]) => {
          if (typeof value === 'string' && value.startsWith('#')) {
            colors.set(`status_${key}`, hexToRgb(value));
          }
        });
      }

      // Parse chart colors
      if (designSystem.colors.chart) {
        Object.entries(designSystem.colors.chart).forEach(([key, value]) => {
          if (typeof value === 'string' && value.startsWith('#')) {
            colors.set(`chart_${key}`, hexToRgb(value));
          }
        });
      }
    }

    return colors;
  }

  // Get sections from manifest
  getSections(manifest: Manifest): ManifestSection[] {
    return manifest.sections || [];
  }

  // Find section by ID
  findSection(manifest: Manifest, sectionId: string): ManifestSection | null {
    return manifest.sections?.find(s => s.id === sectionId) || null;
  }

  // Get section by type
  getSectionsByType(manifest: Manifest, type: string): ManifestSection[] {
    return manifest.sections?.filter(s => s.type === type) || [];
  }

  // Validate manifest structure
  validateManifest(manifest: Manifest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!manifest.page_type) {
      errors.push('Missing page_type');
    }
    if (!manifest.page_name) {
      errors.push('Missing page_name');
    }
    if (!manifest.sections || manifest.sections.length === 0) {
      errors.push('No sections defined');
    }
    if (!manifest.design_system) {
      errors.push('Missing design_system');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get manifest metadata
  getMetadata(manifest: Manifest) {
    return {
      pageType: manifest.page_type,
      pageName: manifest.page_name,
      version: manifest.version,
      framework: manifest.framework,
      styling: manifest.styling,
      description: manifest.description,
      sectionCount: manifest.sections?.length || 0
    };
  }
}

// Singleton instance
const manifestLoader = new ManifestLoader();

export { manifestLoader, ManifestLoader, Manifest, ManifestSection, ManifestColor, hexToRgb };
