// VATANA Complete Design System Generator Plugin for Figma
// Generates comprehensive pages matching the actual VATANA application
// Design System Constants
const COLORS = {
    // Turquoise/Teal palette
    primary: { r: 0.078, g: 0.722, b: 0.651 }, // #14b8a6
    primaryLight: { r: 0.361, g: 0.827, b: 0.765 }, // #5cd3c3
    primaryDark: { r: 0.047, g: 0.545, b: 0.502 }, // #0c8b80
    // Accent colors
    cyan: { r: 0.024, g: 0.714, b: 0.831 }, // #06b6d4
    blue: { r: 0.231, g: 0.510, b: 0.965 }, // #3b82f6
    blueLight: { r: 0.522, g: 0.710, b: 1.000 }, // #85b5ff
    // Status colors
    success: { r: 0.133, g: 0.800, b: 0.467 }, // #22cc77
    warning: { r: 0.976, g: 0.765, b: 0.122 }, // #f9c31f
    error: { r: 0.937, g: 0.267, b: 0.267 }, // #ef4444
    // Dark backgrounds
    bgDark: { r: 0.039, g: 0.055, b: 0.102 }, // #0a0e1a
    bgDarkSecondary: { r: 0.102, g: 0.122, b: 0.208 }, // #1a1f35
    bgCard: { r: 0.125, g: 0.145, b: 0.224 }, // #202539
    bgCardLight: { r: 0.165, g: 0.188, b: 0.275 }, // #2a3046
    // Neutral colors
    white: { r: 1, g: 1, b: 1 },
    gray100: { r: 0.945, g: 0.953, b: 0.965 }, // #f1f5f9
    gray300: { r: 0.804, g: 0.835, b: 0.875 }, // #cbd5e1
    gray400: { r: 0.580, g: 0.639, b: 0.722 }, // #94a3b8
    gray600: { r: 0.282, g: 0.337, b: 0.420 }, // #475569
    gray800: { r: 0.118, g: 0.149, b: 0.196 }, // #1e2632
};
const TYPOGRAPHY = {
    heading1: 48,
    heading2: 36,
    heading3: 28,
    heading4: 24,
    heading5: 20,
    body: 16,
    bodySmall: 14,
    caption: 12,
};
// Global font settings
let FONT_FAMILY = "Manrope";
let FONT_STYLE_REGULAR = "Regular";
let FONT_STYLE_BOLD = "Bold";
// Helper to set font on text nodes
function setTextFont(textNode, style = FONT_STYLE_REGULAR) {
    textNode.fontName = { family: FONT_FAMILY, style: style };
}
// Helper Functions
function createGradient(node, colors, type = 'LINEAR') {
    if ('fills' in node) {
        const gradient = {
            type: type === 'LINEAR' ? 'GRADIENT_LINEAR' : 'GRADIENT_RADIAL',
            gradientStops: colors.map((color, i) => ({
                color: Object.assign(Object.assign({}, color), { a: 1 }),
                position: i / (colors.length - 1),
            })),
            gradientTransform: type === 'LINEAR'
                ? [[1, 0, 0], [0, 1, 0]]
                : [[1, 0, 0.5], [0, 1, 0.5]],
        };
        node.fills = [gradient];
    }
}
function createGlassEffect(node) {
    const glassFill = {
        type: 'SOLID',
        color: COLORS.white,
        opacity: 0.05,
    };
    node.fills = [glassFill];
    node.strokes = [{
            type: 'SOLID',
            color: COLORS.primary,
            opacity: 0.2,
        }];
    node.strokeWeight = 1;
    node.effects = [
        {
            type: 'DROP_SHADOW',
            color: Object.assign(Object.assign({}, COLORS.primary), { a: 0.3 }),
            offset: { x: 0, y: 4 },
            radius: 12,
            visible: true,
            blendMode: 'NORMAL',
        },
        {
            type: 'INNER_SHADOW',
            color: Object.assign(Object.assign({}, COLORS.white), { a: 0.1 }),
            offset: { x: 0, y: 1 },
            radius: 2,
            visible: true,
            blendMode: 'NORMAL',
        }
    ];
    node.cornerRadius = 12;
}
async function loadFonts() {
    try {
        await figma.loadFontAsync({ family: "Manrope", style: "Regular" });
        await figma.loadFontAsync({ family: "Manrope", style: "Bold" });
        FONT_FAMILY = "Manrope";
        FONT_STYLE_REGULAR = "Regular";
        FONT_STYLE_BOLD = "Bold";
        figma.notify('✅ Using Manrope font', { timeout: 2000 });
        return true;
    }
    catch (error) {
        try {
            await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
            await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
            FONT_FAMILY = "Roboto";
            FONT_STYLE_REGULAR = "Regular";
            FONT_STYLE_BOLD = "Bold";
            figma.notify('✅ Using Roboto font (fallback)', { timeout: 2000 });
            return true;
        }
        catch (error2) {
            try {
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                await figma.loadFontAsync({ family: "Inter", style: "Bold" });
                FONT_FAMILY = "Inter";
                FONT_STYLE_REGULAR = "Regular";
                FONT_STYLE_BOLD = "Bold";
                figma.notify('⚠️ Using Inter font (last resort)', { timeout: 3000 });
                return true;
            }
            catch (error3) {
                figma.notify('❌ No compatible fonts found', { timeout: 3000, error: true });
                return false;
            }
        }
    }
}
// Component Creators
function createButton(text, variant = 'primary', width = 200) {
    const button = figma.createFrame();
    button.name = `Button - ${text}`;
    button.resize(width, 44);
    button.cornerRadius = 8;
    button.layoutMode = 'HORIZONTAL';
    button.primaryAxisAlignItems = 'CENTER';
    button.counterAxisAlignItems = 'CENTER';
    button.paddingLeft = 20;
    button.paddingRight = 20;
    button.itemSpacing = 8;
    if (variant === 'primary') {
        createGradient(button, [COLORS.blue, COLORS.blueLight], 'LINEAR');
        button.effects = [{
                type: 'DROP_SHADOW',
                color: Object.assign(Object.assign({}, COLORS.blue), { a: 0.4 }),
                offset: { x: 0, y: 4 },
                radius: 12,
                visible: true,
                blendMode: 'NORMAL',
            }];
    }
    else if (variant === 'secondary') {
        button.fills = [{ type: 'SOLID', color: COLORS.bgCardLight }];
    }
    else {
        button.fills = [];
        button.strokes = [{ type: 'SOLID', color: COLORS.gray600 }];
        button.strokeWeight = 1;
    }
    const buttonText = figma.createText();
    setTextFont(buttonText, FONT_STYLE_BOLD);
    buttonText.characters = text;
    buttonText.fontSize = 14;
    buttonText.fills = [{ type: 'SOLID', color: COLORS.white }];
    button.appendChild(buttonText);
    return button;
}
function createInput(label, placeholder, width = 340) {
    const container = figma.createFrame();
    container.name = `Input - ${label}`;
    container.resize(width, 70);
    container.layoutMode = 'VERTICAL';
    container.itemSpacing = 8;
    container.fills = [];
    // Label
    const labelText = figma.createText();
    setTextFont(labelText, FONT_STYLE_REGULAR);
    labelText.characters = label;
    labelText.fontSize = 14;
    labelText.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
    container.appendChild(labelText);
    // Input field
    const input = figma.createFrame();
    input.resize(width, 44);
    input.cornerRadius = 8;
    input.fills = [{ type: 'SOLID', color: COLORS.bgCardLight }];
    input.strokes = [{ type: 'SOLID', color: COLORS.gray600, opacity: 0.3 }];
    input.strokeWeight = 1;
    input.layoutMode = 'HORIZONTAL';
    input.primaryAxisAlignItems = 'CENTER';
    input.paddingLeft = 16;
    input.paddingRight = 16;
    const placeholderText = figma.createText();
    setTextFont(placeholderText);
    placeholderText.characters = placeholder;
    placeholderText.fontSize = 14;
    placeholderText.fills = [{ type: 'SOLID', color: COLORS.gray600 }];
    input.appendChild(placeholderText);
    container.appendChild(input);
    return container;
}
function createCard(width, height, title) {
    const card = figma.createFrame();
    card.name = title || 'Card';
    card.resize(width, height);
    card.layoutMode = 'VERTICAL';
    card.primaryAxisAlignItems = 'MIN';
    card.counterAxisAlignItems = 'MIN';
    card.paddingTop = 24;
    card.paddingBottom = 24;
    card.paddingLeft = 24;
    card.paddingRight = 24;
    card.itemSpacing = 16;
    card.fills = [{ type: 'SOLID', color: COLORS.bgCard }];
    card.cornerRadius = 12;
    card.strokes = [{ type: 'SOLID', color: COLORS.gray800, opacity: 0.5 }];
    card.strokeWeight = 1;
    if (title) {
        const titleText = figma.createText();
        setTextFont(titleText, FONT_STYLE_BOLD);
        titleText.characters = title;
        titleText.fontSize = TYPOGRAPHY.heading5;
        titleText.fills = [{ type: 'SOLID', color: COLORS.white }];
        card.appendChild(titleText);
    }
    return card;
}
function createStatCard(value, label, icon, color = COLORS.primary) {
    const card = figma.createFrame();
    card.name = `Stat - ${label}`;
    card.resize(250, 100);
    card.cornerRadius = 12;
    card.fills = [{ type: 'SOLID', color: COLORS.bgCard }];
    card.strokes = [{ type: 'SOLID', color: color, opacity: 0.3 }];
    card.strokeWeight = 1;
    card.layoutMode = 'HORIZONTAL';
    card.primaryAxisAlignItems = 'CENTER';
    card.counterAxisAlignItems = 'CENTER';
    card.paddingLeft = 20;
    card.paddingRight = 20;
    card.itemSpacing = 16;
    // Icon container
    const iconCircle = figma.createFrame();
    iconCircle.resize(48, 48);
    iconCircle.cornerRadius = 24;
    iconCircle.fills = [{ type: 'SOLID', color: color, opacity: 0.2 }];
    iconCircle.layoutMode = 'HORIZONTAL';
    iconCircle.primaryAxisAlignItems = 'CENTER';
    iconCircle.counterAxisAlignItems = 'CENTER';
    const iconText = figma.createText();
    setTextFont(iconText);
    iconText.characters = icon;
    iconText.fontSize = 24;
    iconCircle.appendChild(iconText);
    card.appendChild(iconCircle);
    // Text container
    const textContainer = figma.createFrame();
    textContainer.layoutMode = 'VERTICAL';
    textContainer.itemSpacing = 4;
    textContainer.fills = [];
    const valueText = figma.createText();
    setTextFont(valueText, FONT_STYLE_BOLD);
    valueText.characters = value;
    valueText.fontSize = 24;
    valueText.fills = [{ type: 'SOLID', color: COLORS.white }];
    textContainer.appendChild(valueText);
    const labelText = figma.createText();
    setTextFont(labelText);
    labelText.characters = label;
    labelText.fontSize = 12;
    labelText.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
    textContainer.appendChild(labelText);
    card.appendChild(textContainer);
    return card;
}
function createBadge(text, color, bgColor) {
    const badge = figma.createFrame();
    badge.name = `Badge - ${text}`;
    badge.cornerRadius = 6;
    badge.fills = [{ type: 'SOLID', color: bgColor, opacity: 0.2 }];
    badge.layoutMode = 'HORIZONTAL';
    badge.primaryAxisAlignItems = 'CENTER';
    badge.counterAxisAlignItems = 'CENTER';
    badge.paddingLeft = 12;
    badge.paddingRight = 12;
    badge.paddingTop = 6;
    badge.paddingBottom = 6;
    const badgeText = figma.createText();
    setTextFont(badgeText, FONT_STYLE_BOLD);
    badgeText.characters = text;
    badgeText.fontSize = 11;
    badgeText.fills = [{ type: 'SOLID', color: color }];
    badge.appendChild(badgeText);
    return badge;
}
function createProgressBar(value, maxValue, color, width = 300) {
    const container = figma.createFrame();
    container.name = 'Progress Bar';
    container.resize(width, 8);
    container.cornerRadius = 4;
    container.fills = [{ type: 'SOLID', color: COLORS.bgDarkSecondary }];
    const progress = figma.createFrame();
    const progressWidth = (value / maxValue) * width;
    progress.resize(progressWidth, 8);
    progress.cornerRadius = 4;
    progress.fills = [{ type: 'SOLID', color: color }];
    progress.x = 0;
    progress.y = 0;
    container.appendChild(progress);
    return container;
}
function createTableRow(col1, col2, col3, col4, statusColor = COLORS.success) {
    const row = figma.createFrame();
    row.name = 'Table Row';
    row.resize(920, 48);
    row.layoutMode = 'HORIZONTAL';
    row.primaryAxisAlignItems = 'CENTER';
    row.paddingLeft = 16;
    row.paddingRight = 16;
    row.itemSpacing = 24;
    row.fills = [{ type: 'SOLID', color: COLORS.bgCard, opacity: 0.5 }];
    row.cornerRadius = 6;
    // Column 1
    const text1 = figma.createText();
    setTextFont(text1);
    text1.characters = col1;
    text1.fontSize = 13;
    text1.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
    text1.resize(80, text1.height);
    row.appendChild(text1);
    // Column 2
    const text2 = figma.createText();
    setTextFont(text2);
    text2.characters = col2;
    text2.fontSize = 13;
    text2.fills = [{ type: 'SOLID', color: COLORS.white }];
    text2.resize(200, text2.height);
    row.appendChild(text2);
    // Column 3 (Status Badge)
    const badge = createBadge(col3, statusColor, statusColor);
    row.appendChild(badge);
    // Column 4
    const text4 = figma.createText();
    setTextFont(text4);
    text4.characters = col4;
    text4.fontSize = 13;
    text4.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
    row.appendChild(text4);
    return row;
}
// PAGE GENERATORS
async function generateLandingPage(frame) {
    frame.name = '🏠 Landing Page';
    frame.resize(1440, 2000);
    frame.layoutMode = 'VERTICAL';
    frame.primaryAxisSizingMode = 'AUTO';
    frame.itemSpacing = 0;
    frame.fills = [{ type: 'SOLID', color: COLORS.bgDark }];
    // Header
    const header = figma.createFrame();
    header.name = 'Header';
    header.resize(1440, 80);
    header.layoutMode = 'HORIZONTAL';
    header.primaryAxisAlignItems = 'CENTER';
    header.counterAxisAlignItems = 'CENTER';
    header.paddingLeft = 80;
    header.paddingRight = 80;
    header.fills = [];
    const logo = figma.createText();
    setTextFont(logo, FONT_STYLE_BOLD);
    logo.characters = 'VATANA';
    logo.fontSize = 28;
    createGradient(logo, [COLORS.primary, COLORS.cyan]);
    header.appendChild(logo);
    const spacer = figma.createFrame();
    spacer.resize(900, 10);
    spacer.fills = [];
    spacer.layoutMode = 'HORIZONTAL';
    spacer.primaryAxisSizingMode = 'FIXED';
    header.appendChild(spacer);
    header.appendChild(createButton('Sign In', 'outline', 120));
    header.appendChild(createButton('Calculate Your Savings', 'primary', 220));
    frame.appendChild(header);
    // Hero Section
    const hero = figma.createFrame();
    hero.name = 'Hero Section';
    hero.resize(1440, 800);
    hero.layoutMode = 'VERTICAL';
    hero.primaryAxisAlignItems = 'CENTER';
    hero.counterAxisAlignItems = 'CENTER';
    hero.paddingTop = 100;
    hero.paddingBottom = 80;
    hero.itemSpacing = 24;
    hero.fills = [];
    // Alert badge
    const alert = figma.createFrame();
    alert.resize(180, 32);
    alert.cornerRadius = 16;
    alert.fills = [{ type: 'SOLID', color: COLORS.error, opacity: 0.15 }];
    alert.layoutMode = 'HORIZONTAL';
    alert.primaryAxisAlignItems = 'CENTER';
    alert.counterAxisAlignItems = 'CENTER';
    alert.paddingLeft = 12;
    alert.paddingRight = 12;
    alert.itemSpacing = 6;
    const alertIcon = figma.createText();
    setTextFont(alertIcon);
    alertIcon.characters = '⚠️';
    alertIcon.fontSize = 14;
    alert.appendChild(alertIcon);
    const alertText = figma.createText();
    setTextFont(alertText, FONT_STYLE_BOLD);
    alertText.characters = 'Critical Business Alert';
    alertText.fontSize = 11;
    alertText.fills = [{ type: 'SOLID', color: COLORS.error }];
    alert.appendChild(alertText);
    hero.appendChild(alert);
    // Main heading
    const heading = figma.createFrame();
    heading.layoutMode = 'VERTICAL';
    heading.itemSpacing = 8;
    heading.fills = [];
    heading.primaryAxisAlignItems = 'CENTER';
    const headingLine1 = figma.createText();
    setTextFont(headingLine1, FONT_STYLE_BOLD);
    headingLine1.characters = 'Stop Paying €30,000+';
    headingLine1.fontSize = 56;
    headingLine1.fills = [{ type: 'SOLID', color: COLORS.error }];
    headingLine1.textAlignHorizontal = 'CENTER';
    heading.appendChild(headingLine1);
    const headingLine2 = figma.createText();
    setTextFont(headingLine2, FONT_STYLE_BOLD);
    headingLine2.characters = 'for VAT Compliance That Takes Weeks';
    headingLine2.fontSize = 44;
    headingLine2.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
    headingLine2.textAlignHorizontal = 'CENTER';
    heading.appendChild(headingLine2);
    hero.appendChild(heading);
    // Subheading
    const subheading = figma.createText();
    setTextFont(subheading);
    subheading.characters = 'Get Enterprise Results in 60 Seconds for €99/Month';
    subheading.fontSize = 28;
    createGradient(subheading, [COLORS.primary, COLORS.cyan]);
    subheading.textAlignHorizontal = 'CENTER';
    hero.appendChild(subheading);
    // Description
    const description = figma.createText();
    setTextFont(description);
    description.characters = 'AI-powered VAT compliance that replaces expensive consultants. Save 95% on\ncompliance costs while preventing costly penalties.';
    description.fontSize = 16;
    description.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
    description.textAlignHorizontal = 'CENTER';
    description.resize(700, description.height);
    hero.appendChild(description);
    // Feature badges
    const features = figma.createFrame();
    features.layoutMode = 'HORIZONTAL';
    features.itemSpacing = 16;
    features.fills = [];
    const badges = [
        { icon: '✅', text: '95% Cost Reduction' },
        { icon: '⚡', text: 'Instant Results' },
        { icon: '📊', text: '95% Accuracy' },
        { icon: '🛡️', text: 'Zero Penalties' }
    ];
    badges.forEach(b => {
        const badge = figma.createFrame();
        badge.cornerRadius = 20;
        badge.fills = [{ type: 'SOLID', color: COLORS.bgCard }];
        badge.strokes = [{ type: 'SOLID', color: COLORS.primary, opacity: 0.3 }];
        badge.strokeWeight = 1;
        badge.layoutMode = 'HORIZONTAL';
        badge.paddingLeft = 16;
        badge.paddingRight = 16;
        badge.paddingTop = 10;
        badge.paddingBottom = 10;
        badge.itemSpacing = 8;
        const icon = figma.createText();
        setTextFont(icon);
        icon.characters = b.icon;
        icon.fontSize = 16;
        badge.appendChild(icon);
        const text = figma.createText();
        setTextFont(text, FONT_STYLE_BOLD);
        text.characters = b.text;
        text.fontSize = 13;
        text.fills = [{ type: 'SOLID', color: COLORS.white }];
        badge.appendChild(text);
        features.appendChild(badge);
    });
    hero.appendChild(features);
    // CTA Buttons
    const ctas = figma.createFrame();
    ctas.layoutMode = 'HORIZONTAL';
    ctas.itemSpacing = 16;
    ctas.fills = [];
    ctas.appendChild(createButton('Calculate Your Savings →', 'primary', 240));
    ctas.appendChild(createButton('See Live AI Demo', 'secondary', 200));
    hero.appendChild(ctas);
    frame.appendChild(hero);
    // Comparison Section
    const comparison = figma.createFrame();
    comparison.name = 'Comparison';
    comparison.resize(1440, 400);
    comparison.layoutMode = 'HORIZONTAL';
    comparison.primaryAxisAlignItems = 'CENTER';
    comparison.counterAxisAlignItems = 'CENTER';
    comparison.paddingLeft = 200;
    comparison.paddingRight = 200;
    comparison.itemSpacing = 40;
    comparison.fills = [];
    // Old Way Card
    const oldWay = createCard(440, 280, '');
    oldWay.fills = [{ type: 'SOLID', color: COLORS.error, opacity: 0.1 }];
    oldWay.strokes = [{ type: 'SOLID', color: COLORS.error, opacity: 0.3 }];
    const oldTitle = figma.createText();
    setTextFont(oldTitle, FONT_STYLE_BOLD);
    oldTitle.characters = 'Old Way';
    oldTitle.fontSize = 24;
    oldTitle.fills = [{ type: 'SOLID', color: COLORS.error }];
    oldTitle.textAlignHorizontal = 'CENTER';
    oldWay.appendChild(oldTitle);
    const oldItems = [
        { label: 'Annual Costs:', value: '€30,000+', color: COLORS.error },
        { label: 'Processing Time:', value: '2-3 weeks', color: COLORS.error },
        { label: 'Error Rate:', value: '15-30%', color: COLORS.error }
    ];
    oldItems.forEach(item => {
        const row = figma.createFrame();
        row.layoutMode = 'HORIZONTAL';
        row.primaryAxisAlignItems = 'CENTER';
        row.fills = [];
        row.resize(392, 32);
        const label = figma.createText();
        setTextFont(label);
        label.characters = item.label;
        label.fontSize = 16;
        label.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
        label.resize(200, label.height);
        row.appendChild(label);
        const value = figma.createText();
        setTextFont(value, FONT_STYLE_BOLD);
        value.characters = item.value;
        value.fontSize = 18;
        value.fills = [{ type: 'SOLID', color: item.color }];
        value.textAlignHorizontal = 'RIGHT';
        value.resize(192, value.height);
        row.appendChild(value);
        oldWay.appendChild(row);
    });
    comparison.appendChild(oldWay);
    // Vatana Way Card
    const vatanaWay = createCard(440, 280, '');
    vatanaWay.fills = [{ type: 'SOLID', color: COLORS.primary, opacity: 0.1 }];
    vatanaWay.strokes = [{ type: 'SOLID', color: COLORS.primary, opacity: 0.5 }];
    const vatanaTitle = figma.createText();
    setTextFont(vatanaTitle, FONT_STYLE_BOLD);
    vatanaTitle.characters = 'Vatana Way';
    vatanaTitle.fontSize = 24;
    vatanaTitle.fills = [{ type: 'SOLID', color: COLORS.primary }];
    vatanaTitle.textAlignHorizontal = 'CENTER';
    vatanaWay.appendChild(vatanaTitle);
    const vatanaItems = [
        { label: 'Annual Costs:', value: '€1,200', color: COLORS.success },
        { label: 'Processing Time:', value: '60 seconds', color: COLORS.success },
        { label: 'Error Rate:', value: '< 5%', color: COLORS.success }
    ];
    vatanaItems.forEach(item => {
        const row = figma.createFrame();
        row.layoutMode = 'HORIZONTAL';
        row.primaryAxisAlignItems = 'CENTER';
        row.fills = [];
        row.resize(392, 32);
        const label = figma.createText();
        setTextFont(label);
        label.characters = item.label;
        label.fontSize = 16;
        label.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
        label.resize(200, label.height);
        row.appendChild(label);
        const value = figma.createText();
        setTextFont(value, FONT_STYLE_BOLD);
        value.characters = item.value;
        value.fontSize = 18;
        value.fills = [{ type: 'SOLID', color: item.color }];
        value.textAlignHorizontal = 'RIGHT';
        value.resize(192, value.height);
        row.appendChild(value);
        vatanaWay.appendChild(row);
    });
    comparison.appendChild(vatanaWay);
    frame.appendChild(comparison);
}
async function generateSignupPage(frame) {
    frame.name = '📝 Sign Up Page';
    frame.resize(1440, 1000);
    frame.fills = [{ type: 'SOLID', color: COLORS.bgDark }];
    // Main container
    const container = figma.createFrame();
    container.name = 'Container';
    container.resize(1440, 1000);
    container.layoutMode = 'VERTICAL';
    container.primaryAxisAlignItems = 'CENTER';
    container.counterAxisAlignItems = 'CENTER';
    container.paddingTop = 60;
    container.fills = [];
    // Title
    const title = figma.createText();
    setTextFont(title, FONT_STYLE_BOLD);
    title.characters = 'Join 500+ Companies Saving €Thousands on VAT Compliance';
    title.fontSize = 32;
    title.fills = [{ type: 'SOLID', color: COLORS.white }];
    title.textAlignHorizontal = 'CENTER';
    title.resize(800, title.height);
    container.appendChild(title);
    // Subtitle
    const subtitle = figma.createText();
    setTextFont(subtitle);
    subtitle.characters = 'Companies like yours typically save €28,800 annually';
    subtitle.fontSize = 16;
    subtitle.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
    subtitle.textAlignHorizontal = 'CENTER';
    subtitle.y = 80;
    container.appendChild(subtitle);
    // Progress stepper
    const stepper = figma.createFrame();
    stepper.name = 'Stepper';
    stepper.resize(960, 100);
    stepper.layoutMode = 'HORIZONTAL';
    stepper.primaryAxisAlignItems = 'CENTER';
    stepper.counterAxisAlignItems = 'CENTER';
    stepper.paddingLeft = 40;
    stepper.paddingRight = 40;
    stepper.itemSpacing = 0;
    stepper.fills = [{ type: 'SOLID', color: COLORS.bgCard }];
    stepper.cornerRadius = 12;
    stepper.y = 130;
    const steps = [
        { icon: '🏢', title: 'Company Information', subtitle: '2 minutes to start saving thousands' },
        { icon: '📊', title: 'Business Profile', subtitle: 'Help us calculate your savings potential' },
        { icon: '📋', title: 'Plan Selection', subtitle: 'Choose your savings level' }
    ];
    steps.forEach((step, i) => {
        const stepItem = figma.createFrame();
        stepItem.layoutMode = 'HORIZONTAL';
        stepItem.itemSpacing = 16;
        stepItem.fills = [];
        stepItem.primaryAxisAlignItems = 'CENTER';
        // Icon circle
        const circle = figma.createFrame();
        circle.resize(48, 48);
        circle.cornerRadius = 24;
        if (i === 0) {
            circle.fills = [{ type: 'SOLID', color: COLORS.blue }];
        }
        else {
            circle.fills = [{ type: 'SOLID', color: COLORS.bgCardLight }];
        }
        circle.layoutMode = 'HORIZONTAL';
        circle.primaryAxisAlignItems = 'CENTER';
        circle.counterAxisAlignItems = 'CENTER';
        const icon = figma.createText();
        setTextFont(icon);
        icon.characters = step.icon;
        icon.fontSize = 20;
        circle.appendChild(icon);
        stepItem.appendChild(circle);
        // Text
        const textContainer = figma.createFrame();
        textContainer.layoutMode = 'VERTICAL';
        textContainer.itemSpacing = 4;
        textContainer.fills = [];
        const stepTitle = figma.createText();
        setTextFont(stepTitle, FONT_STYLE_BOLD);
        stepTitle.characters = step.title;
        stepTitle.fontSize = 14;
        stepTitle.fills = [{ type: 'SOLID', color: i === 0 ? COLORS.blue : COLORS.gray500 }];
        textContainer.appendChild(stepTitle);
        const stepSubtitle = figma.createText();
        setTextFont(stepSubtitle);
        stepSubtitle.characters = step.subtitle;
        stepSubtitle.fontSize = 11;
        stepSubtitle.fills = [{ type: 'SOLID', color: COLORS.gray600 }];
        textContainer.appendChild(stepSubtitle);
        stepItem.appendChild(textContainer);
        stepper.appendChild(stepItem);
        // Add progress bar between steps
        if (i < steps.length - 1) {
            const progressBar = figma.createFrame();
            progressBar.resize(60, 4);
            progressBar.cornerRadius = 2;
            progressBar.fills = [{ type: 'SOLID', color: i === 0 ? COLORS.blue : COLORS.bgCardLight }];
            stepper.appendChild(progressBar);
        }
    });
    container.appendChild(stepper);
    // Main content area
    const content = figma.createFrame();
    content.name = 'Content';
    content.resize(1200, 600);
    content.layoutMode = 'HORIZONTAL';
    content.itemSpacing = 40;
    content.fills = [];
    content.y = 260;
    // Form Card
    const formCard = createCard(640, 560, '');
    formCard.fills = [{ type: 'SOLID', color: COLORS.bgCard }];
    const formTitle = figma.createText();
    setTextFont(formTitle, FONT_STYLE_BOLD);
    formTitle.characters = 'Step 1: Company Information';
    formTitle.fontSize = 22;
    formTitle.fills = [{ type: 'SOLID', color: COLORS.white }];
    formCard.appendChild(formTitle);
    // Form inputs
    formCard.appendChild(createInput('Company Name *', 'Your Company Ltd'));
    formCard.appendChild(createInput('Business Email *', 'finance@company.com'));
    formCard.appendChild(createInput('VAT ID *', 'DE123456789'));
    formCard.appendChild(createInput('Country *', 'Select your country'));
    formCard.appendChild(createInput('Password *', 'Min 8 characters'));
    formCard.appendChild(createInput('Confirm Password *', 'Confirm your password'));
    // Form buttons
    const formButtons = figma.createFrame();
    formButtons.layoutMode = 'HORIZONTAL';
    formButtons.itemSpacing = 16;
    formButtons.fills = [];
    formButtons.resize(592, 44);
    const backBtn = createButton('← Back', 'outline', 120);
    formButtons.appendChild(backBtn);
    const spacerBtn = figma.createFrame();
    spacerBtn.resize(352, 10);
    spacerBtn.fills = [];
    formButtons.appendChild(spacerBtn);
    const continueBtn = createButton('Continue →', 'primary', 120);
    formButtons.appendChild(continueBtn);
    formCard.appendChild(formButtons);
    content.appendChild(formCard);
    // Savings Preview Card
    const savingsCard = createCard(520, 560, '');
    savingsCard.fills = [{ type: 'SOLID', color: COLORS.bgCardLight }];
    const savingsTitle = figma.createText();
    setTextFont(savingsTitle, FONT_STYLE_BOLD);
    savingsTitle.characters = 'Real-time Savings Preview';
    savingsTitle.fontSize = 18;
    savingsTitle.fills = [{ type: 'SOLID', color: COLORS.blue }];
    savingsCard.appendChild(savingsTitle);
    // Comparison items
    const compItem1 = figma.createFrame();
    compItem1.layoutMode = 'HORIZONTAL';
    compItem1.primaryAxisAlignItems = 'CENTER';
    compItem1.fills = [];
    compItem1.resize(472, 32);
    const label1 = figma.createText();
    setTextFont(label1);
    label1.characters = 'Traditional VAT compliance:';
    label1.fontSize = 14;
    label1.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
    label1.resize(300, label1.height);
    compItem1.appendChild(label1);
    const value1 = figma.createText();
    setTextFont(value1, FONT_STYLE_BOLD);
    value1.characters = '€30,844/year';
    value1.fontSize = 16;
    value1.fills = [{ type: 'SOLID', color: COLORS.error }];
    value1.textAlignHorizontal = 'RIGHT';
    value1.resize(172, value1.height);
    compItem1.appendChild(value1);
    savingsCard.appendChild(compItem1);
    // Vatana Plan
    const compItem2 = figma.createFrame();
    compItem2.layoutMode = 'HORIZONTAL';
    compItem2.primaryAxisAlignItems = 'CENTER';
    compItem2.fills = [];
    compItem2.resize(472, 32);
    const label2 = figma.createText();
    setTextFont(label2);
    label2.characters = 'Vatana Pro Plan:';
    label2.fontSize = 14;
    label2.fills = [{ type: 'SOLID', color: COLORS.gray300 }];
    label2.resize(300, label2.height);
    compItem2.appendChild(label2);
    const value2 = figma.createText();
    setTextFont(value2, FONT_STYLE_BOLD);
    value2.characters = '€1,188/year';
    value2.fontSize = 16;
    value2.fills = [{ type: 'SOLID', color: COLORS.success }];
    value2.textAlignHorizontal = 'RIGHT';
    value2.resize(172, value2.height);
    compItem2.appendChild(value2);
    savingsCard.appendChild(compItem2);
    // Divider
    const divider = figma.createFrame();
    divider.resize(472, 2);
    divider.fills = [{ type: 'SOLID', color: COLORS.primary }];
    savingsCard.appendChild(divider);
    // Annual Savings
    const savingsRow = figma.createFrame();
    savingsRow.layoutMode = 'HORIZONTAL';
    savingsRow.primaryAxisAlignItems = 'CENTER';
    savingsRow.fills = [];
    savingsRow.resize(472, 48);
    const savingsLabel = figma.createText();
    setTextFont(savingsLabel, FONT_STYLE_BOLD);
    savingsLabel.characters = 'Your Annual Savings:';
    savingsLabel.fontSize = 16;
    savingsLabel.fills = [{ type: 'SOLID', color: COLORS.white }];
    savingsLabel.resize(300, savingsLabel.height);
    savingsRow.appendChild(savingsLabel);
    const savingsValue = figma.createText();
    setTextFont(savingsValue, FONT_STYLE_BOLD);
    savingsValue.characters = '€28,812';
    savingsValue.fontSize = 28;
    createGradient(savingsValue, [COLORS.primary, COLORS.cyan]);
    savingsValue.textAlignHorizontal = 'RIGHT';
    savingsValue.resize(172, savingsValue.height);
    savingsRow.appendChild(savingsValue);
    savingsCard.appendChild(savingsRow);
    // CTA Button
    const ctaBtn = createButton('↓ SAVE 98%', 'primary', 472);
    ctaBtn.resize(472, 52);
    savingsCard.appendChild(ctaBtn);
    content.appendChild(savingsCard);
    container.appendChild(content);
    frame.appendChild(container);
}
// Main plugin logic
figma.showUI(__html__, { width: 420, height: 680 });
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'generate') {
        try {
            figma.notify('⏳ Loading fonts...', { timeout: 1000 });
            await loadFonts();
            const pages = msg.pages;
            let createdCount = 0;
            figma.notify(`🎨 Generating ${pages.length} page(s)...`, { timeout: 2000 });
            for (const pageName of pages) {
                const frame = figma.createFrame();
                frame.x = createdCount * 1500;
                frame.y = 0;
                switch (pageName) {
                    case 'landing':
                        await generateLandingPage(frame);
                        break;
                    case 'signup':
                        await generateSignupPage(frame);
                        break;
                    case 'manifest:landing': {
                        // Generate from landing manifest
                        const meta = require('./manifest-loader');
                        const loader = meta.manifestLoader;
                        const manifest = loader.getManifest('landing');
                        if (manifest) {
                            frame.name = `🧩 ${manifest.page_name}`;
                            // Basic scaffold from manifest metadata
                            const title = figma.createText();
                            setTextFont(title, FONT_STYLE_BOLD);
                            title.characters = manifest.page_name;
                            title.fontSize = 28;
                            title.fills = [{ type: 'SOLID', color: COLORS.white }];
                            frame.appendChild(title);
                            const info = figma.createText();
                            setTextFont(info);
                            info.characters = `Sections: ${manifest.sections.length}`;
                            info.fontSize = 14;
                            info.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
                            info.y = 40;
                            frame.appendChild(info);
                        }
                        break;
                    }
                    case 'manifest:dashboard': {
                        const meta = require('./manifest-loader');
                        const loader = meta.manifestLoader;
                        const manifest = loader.getManifest('dashboard');
                        if (manifest) {
                            frame.name = `🧩 ${manifest.page_name}`;
                            const title = figma.createText();
                            setTextFont(title, FONT_STYLE_BOLD);
                            title.characters = manifest.page_name;
                            title.fontSize = 28;
                            title.fills = [{ type: 'SOLID', color: COLORS.white }];
                            frame.appendChild(title);
                            const info = figma.createText();
                            setTextFont(info);
                            info.characters = `Sections: ${manifest.sections.length}`;
                            info.fontSize = 14;
                            info.fills = [{ type: 'SOLID', color: COLORS.gray400 }];
                            info.y = 40;
                            frame.appendChild(info);
                        }
                        break;
                    }
                    default:
                        frame.name = '📄 Page';
                }
                figma.currentPage.appendChild(frame);
                createdCount++;
            }
            figma.viewport.scrollAndZoomIntoView([figma.currentPage.children[figma.currentPage.children.length - createdCount]]);
            figma.notify(`✅ Successfully created ${createdCount} page(s)!`, { timeout: 3000 });
            figma.ui.postMessage({ type: 'complete', count: createdCount });
        }
        catch (error) {
            console.error('Plugin error:', error);
            figma.notify(`❌ Error: ${error.message}`, { timeout: 5000, error: true });
            figma.ui.postMessage({ type: 'error', message: error.message });
        }
    }
    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
