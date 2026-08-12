import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable,
    KeepTogether,
    Table,
    TableStyle,
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "generated_resumes"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# COLORS & STYLES SYSTEM (MATCHING CANDIDATE RESUME TEMPLATE)
# ============================================================

DARK_TEXT = colors.HexColor("#000000")
BODY_TEXT = colors.HexColor("#1A1A1A")
MUTED_TEXT = colors.HexColor("#333333")
LINE_COLOR = colors.HexColor("#000000")
LINK_COLOR = colors.HexColor("#0000EE")


# ============================================================
# HELPERS
# ============================================================

def safe_xml(value) -> str:
    """
    Safely convert value to string and format XML entities
    for ReportLab Paragraphs, preserving valid XML tags like <b>, <i>, <u>, <a>, <font>.
    """
    if value is None:
        return ""

    text = str(value).strip()
    if not text:
        return ""

    # Replace raw '&' that are not part of an existing XML entity
    text = re.sub(r"&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)", "&amp;", text)
    return text


def safe_filename(name: str) -> str:
    """
    Create a filesystem-safe filename.
    """
    if not name:
        return "Candidate"

    invalid_characters = '<>:"/\\|?*'
    cleaned = "".join("_" if char in invalid_characters else char for char in name)
    cleaned = "_".join(cleaned.split())
    return cleaned or "Candidate"


def get_field(obj, attr, default=""):
    """
    Safely get attribute from Pydantic model, dictionary, or generic object.
    """
    if obj is None:
        return default
    if isinstance(obj, dict):
        val = obj.get(attr, default)
    else:
        val = getattr(obj, attr, default)
    return val if val is not None else default


def make_header_table(left_line1, right_line1, left_line2="", right_line2="", col_widths=None, styles=None):
    """
    Create a 2-column table for header lines (Company/Location or Role/Duration)
    with exact left and right edge alignment.
    """
    if col_widths is None:
        col_widths = [128 * mm, 52 * mm]

    p_left1 = Paragraph(left_line1, styles["HeaderLeftBold"])
    p_right1 = Paragraph(right_line1, styles["HeaderRightBold"])

    table_data = [[p_left1, p_right1]]

    if left_line2 or right_line2:
        p_left2 = Paragraph(left_line2, styles["HeaderLeftItalic"])
        p_right2 = Paragraph(right_line2, styles["HeaderRightItalic"])
        table_data.append([p_left2, p_right2])

    t = Table(table_data, colWidths=col_widths)
    t.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ])
    )
    return t


def add_section_header(story, title_text, section_style):
    """
    Add a section title followed by a thin full-width black line, matching the template.
    """
    story.append(Paragraph(title_text, section_style))
    story.append(
        HRFlowable(
            width="100%",
            thickness=0.6,
            color=LINE_COLOR,
            spaceBefore=1,
            spaceAfter=5,
        )
    )


def add_page_number(canvas, doc):
    """
    Add a subtle page number at the bottom of every page.
    """
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED_TEXT)
    canvas.drawCentredString(A4[0] / 2, 8 * mm, f"Page {doc.page}")
    canvas.restoreState()


# ============================================================
# MAIN RESUME PDF GENERATION
# ============================================================

def generate_resume_pdf(metadata, rewritten_resume) -> Path:
    """
    Generate a clean, professional ATS-friendly resume PDF strictly following
    the provided candidate CV template (Arslan Ali template layout).
    """

    # --------------------------------------------------------
    # Extract Candidate Metadata
    # --------------------------------------------------------
    candidate_name = get_field(metadata, "candidate_name", "Candidate")
    candidate_name = str(candidate_name).strip() or "Candidate"

    email = get_field(metadata, "email", "")
    phone = get_field(metadata, "phone", "")
    location = get_field(metadata, "location", "")
    linkedin = get_field(metadata, "linkedin", "")
    github = get_field(metadata, "github", "")

    # PDF Filepath
    filename = f"{safe_filename(candidate_name)}_ATS_Resume.pdf"
    pdf_path = OUTPUT_DIR / filename

    # Document setup (A4, 15mm side margins, 8mm top/bottom margins)
    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=8 * mm,
        bottomMargin=8 * mm,
        title=f"{candidate_name} - Resume",
        author="ATS Resume Analyzer",
    )

    col_widths = [130 * mm, 50 * mm]

    # --------------------------------------------------------
    # STYLES SETUP
    # --------------------------------------------------------
    styles = getSampleStyleSheet()

    # Candidate Name (Centered, Large, Bold)
    name_style = ParagraphStyle(
        "TemplateName",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=19,
        leading=22,
        alignment=TA_CENTER,
        textColor=DARK_TEXT,
        spaceAfter=2,
    )

    # Contact Line (Centered)
    contact_style = ParagraphStyle(
        "TemplateContact",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        alignment=TA_CENTER,
        textColor=MUTED_TEXT,
        spaceAfter=5,
    )

    # Section Heading (Bold, Left, Dark)
    section_style = ParagraphStyle(
        "TemplateSectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=12.5,
        textColor=DARK_TEXT,
        spaceBefore=5,
        spaceAfter=1,
        keepWithNext=True,
    )

    # Body Paragraph
    body_style = ParagraphStyle(
        "TemplateBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.2,
        textColor=BODY_TEXT,
        alignment=TA_LEFT,
        spaceAfter=2,
    )

    # Bullet Paragraph
    bullet_style = ParagraphStyle(
        "TemplateBullet",
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-7,
        spaceAfter=1.2,
        leading=11,
    )

    # Header Table Cell Styles
    styles.add(
        ParagraphStyle(
            "HeaderLeftBold",
            parent=body_style,
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=12,
            textColor=DARK_TEXT,
            alignment=TA_LEFT,
            spaceAfter=0,
        )
    )

    styles.add(
        ParagraphStyle(
            "HeaderRightBold",
            parent=body_style,
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=12,
            textColor=DARK_TEXT,
            alignment=TA_RIGHT,
            spaceAfter=0,
        )
    )

    styles.add(
        ParagraphStyle(
            "HeaderLeftItalic",
            parent=body_style,
            fontName="Helvetica-Oblique",
            fontSize=8.8,
            leading=11.5,
            textColor=BODY_TEXT,
            alignment=TA_LEFT,
            spaceAfter=0,
        )
    )

    styles.add(
        ParagraphStyle(
            "HeaderRightItalic",
            parent=body_style,
            fontName="Helvetica-Oblique",
            fontSize=8.8,
            leading=11.5,
            textColor=BODY_TEXT,
            alignment=TA_RIGHT,
            spaceAfter=0,
        )
    )

    story = []

    # ========================================================
    # HEADER SECTION
    # ========================================================
    story.append(Paragraph(safe_xml(candidate_name), name_style))

    contact_parts = []

    if phone:
        contact_parts.append(f"Phone {safe_xml(phone)}")

    if email:
        clean_email = safe_xml(email)
        contact_parts.append(f'<a href="mailto:{clean_email}"><font color="#0000EE"><u>{clean_email}</u></font></a>')

    if linkedin:
        clean_link = safe_xml(linkedin)
        href = clean_link if clean_link.startswith("http") else f"https://{clean_link}"
        display = clean_link.replace("https://", "").replace("http://", "").rstrip("/")
        contact_parts.append(f'<a href="{href}"><font color="#0000EE"><u>{display}</u></font></a>')

    elif github:
        clean_gh = safe_xml(github)
        href = clean_gh if clean_gh.startswith("http") else f"https://{clean_gh}"
        display = clean_gh.replace("https://", "").replace("http://", "").rstrip("/")
        contact_parts.append(f'<a href="{href}"><font color="#0000EE"><u>{display}</u></font></a>')

    if location and not (linkedin or github):
        contact_parts.append(safe_xml(location))

    if contact_parts:
        story.append(Paragraph(" &nbsp;|&nbsp; ".join(contact_parts), contact_style))
    else:
        story.append(Spacer(1, 4))

    # ========================================================
    # 1. SUMMARY SECTION
    # ========================================================
    professional_summary = get_field(rewritten_resume, "professional_summary", None)
    summary_content = ""
    if professional_summary:
        summary_content = get_field(professional_summary, "content", "")
    elif isinstance(rewritten_resume, dict):
        summary_content = rewritten_resume.get("professional_summary", "")

    if not summary_content and hasattr(metadata, "summary"):
        summary_content = metadata.summary

    if summary_content:
        add_section_header(story, "SUMMARY", section_style)
        story.append(Paragraph(safe_xml(summary_content), body_style))
        story.append(Spacer(1, 4))

    # ========================================================
    # 2. EXPERIENCE SECTION
    # ========================================================
    experience_list = get_field(rewritten_resume, "experience", [])

    if experience_list:
        add_section_header(story, "EXPERIENCE", section_style)

        for item in experience_list:
            company = safe_xml(get_field(item, "company", ""))
            loc = safe_xml(get_field(item, "location", ""))
            role = safe_xml(get_field(item, "role", ""))
            duration = safe_xml(get_field(item, "duration", ""))
            bullets = get_field(item, "bullets", [])

            exp_block = []

            # Left/Right aligned headers
            header_table = make_header_table(
                left_line1=f"<b>{company}</b>" if company else "",
                right_line1=f"<b>{loc}</b>" if loc else "",
                left_line2=f"<i>{role}</i>" if role else "",
                right_line2=f"<i>{duration}</i>" if duration else "",
                col_widths=col_widths,
                styles=styles,
            )
            exp_block.append(header_table)
            exp_block.append(Spacer(1, 2))

            for bullet in bullets:
                if not bullet:
                    continue
                exp_block.append(Paragraph(f"• {safe_xml(bullet)}", bullet_style))

            exp_block.append(Spacer(1, 4))
            story.append(KeepTogether(exp_block))

    # ========================================================
    # 3. EDUCATION SECTION
    # ========================================================
    education_list = get_field(rewritten_resume, "education", [])

    if education_list:
        add_section_header(story, "EDUCATION", section_style)

        for item in education_list:
            institute = safe_xml(get_field(item, "institute", ""))
            loc = safe_xml(get_field(item, "location", ""))
            degree = safe_xml(get_field(item, "degree", ""))
            duration = safe_xml(get_field(item, "duration", ""))

            edu_block = []
            header_table = make_header_table(
                left_line1=f"<b>{institute}</b>" if institute else "",
                right_line1=f"<b>{loc}</b>" if loc else "",
                left_line2=f"<i>{degree}</i>" if degree else "",
                right_line2=f"<i>{duration}</i>" if duration else "",
                col_widths=col_widths,
                styles=styles,
            )
            edu_block.append(header_table)
            edu_block.append(Spacer(1, 4))
            story.append(KeepTogether(edu_block))

    # ========================================================
    # 4. PROJECTS SECTION
    # ========================================================
    projects_list = get_field(rewritten_resume, "projects", [])

    if projects_list:
        add_section_header(story, "PROJECTS", section_style)

        for project in projects_list:
            title = safe_xml(get_field(project, "title", ""))
            technologies = get_field(project, "technologies", [])
            date_val = safe_xml(get_field(project, "date", "") or get_field(project, "duration", ""))
            bullets = get_field(project, "bullets", [])

            proj_block = []

            tech_str = ""
            if isinstance(technologies, list) and technologies:
                tech_str = ", ".join(safe_xml(t) for t in technologies)
            elif isinstance(technologies, str) and technologies:
                tech_str = safe_xml(technologies)

            left_line = f"<b>{title}</b>"
            if tech_str:
                left_line += f" &nbsp;|&nbsp; <i>{tech_str}</i>"

            header_table = make_header_table(
                left_line1=left_line,
                right_line1=f"<i>{date_val}</i>" if date_val else "",
                col_widths=col_widths,
                styles=styles,
            )
            proj_block.append(header_table)
            proj_block.append(Spacer(1, 2))

            for bullet in bullets:
                if not bullet:
                    continue
                proj_block.append(Paragraph(f"• {safe_xml(bullet)}", bullet_style))

            proj_block.append(Spacer(1, 4))
            story.append(KeepTogether(proj_block))

    # ========================================================
    # 5. TECHNICAL SKILLS SECTION
    # ========================================================
    skills_categories = get_field(rewritten_resume, "skills", [])

    if skills_categories:
        add_section_header(story, "TECHNICAL SKILLS", section_style)

        skills_block = []
        for cat in skills_categories:
            cat_name = safe_xml(get_field(cat, "category", ""))
            cat_skills = get_field(cat, "skills", [])

            if isinstance(cat_skills, list):
                skills_str = ", ".join(safe_xml(s) for s in cat_skills)
            else:
                skills_str = safe_xml(cat_skills)

            if cat_name and skills_str:
                line_text = f"<b>{cat_name}:</b> {skills_str}"
                skills_block.append(Paragraph(line_text, body_style))

        if skills_block:
            skills_block.append(Spacer(1, 4))
            story.append(KeepTogether(skills_block))

    # ========================================================
    # 6. CERTIFICATIONS SECTION
    # ========================================================
    certifications_list = get_field(rewritten_resume, "certifications", [])

    if certifications_list:
        add_section_header(story, "CERTIFICATIONS", section_style)

        cert_block = []
        for cert in certifications_list:
            cert_name = safe_xml(get_field(cert, "name", "") or str(cert))
            cert_url = safe_xml(get_field(cert, "url", ""))

            if not cert_name:
                continue

            if cert_url:
                cert_text = f'• {cert_name} (<a href="{cert_url}"><font color="#0000EE"><u>View Certification</u></font></a>)'
            else:
                cert_text = f"• {cert_name}"

            cert_block.append(Paragraph(cert_text, bullet_style))

        if cert_block:
            cert_block.append(Spacer(1, 4))
            story.append(KeepTogether(cert_block))

    # ========================================================
    # BUILD PDF DOCUMENT
    # ========================================================
    doc.build(
        story,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number,
    )

    return pdf_path
