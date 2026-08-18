from pathlib import Path
from app.services.resume_generator import generate_resume_pdf
from app.schemas.resume_metadata import ResumeMetadata
from app.schemas.resume_rewrite_schema import (
    ResumeRewrite,
    ProfessionalSummary,
    SkillCategory,
    ExperienceItem,
    EducationItem,
    ProjectItem,
    CertificationItem,
    ImprovementSuggestions,
)

# Build Arslan Ali candidate metadata
metadata = ResumeMetadata(
    candidate_name="Arslan Ali",
    email="arslanali8088@gmail.com",
    phone="+92 3125861567",
    skills=["Python", "SQL", "Power BI", "Excel", "Machine Learning", "Scikit-learn"],
    education="Bachelor of Science in Computer Science",
    experience_years=1.0,
    current_role="Data Scientist & Machine Learning",
    location="Faisalabad, Pakistan",
    linkedin="www.linkedin.com/in/arslanalics",
    github="",
    summary="Data Analyst skilled in Python, SQL, Power BI, Advanced Excel, and Machine Learning."
)

# Build Arslan Ali rewritten resume object matching the template
rewritten_resume = ResumeRewrite(
    professional_summary=ProfessionalSummary(
        content="I am a Data Analyst with a strong understanding of data analysis and visualization, skilled in using Python (NumPy, Pandas, Seaborn, Matplotlib), SQL, Power BI, and Advanced Excel. I have experience in data cleaning, transforming raw data into meaningful insights, and building interactive dashboards. I enjoy working in team environments to analyze and solve real-world problems and aim to use my skills to deliver data-driven solutions while continuously expanding my knowledge. I am also actively exploring and building a foundation in Machine Learning and Artificial Intelligence, with the goal of integrating predictive analytics and intelligent solutions into my future work."
    ),
    skills=[
        SkillCategory(
            category="Languages",
            skills=["C/C++", "Python", "JavaScript", "MY SQL"]
        ),
        SkillCategory(
            category="Libraries",
            skills=["NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn"]
        ),
        SkillCategory(
            category="Data Analytics & Visualization",
            skills=["Excel", "Power Query", "Power BI", "DAX"]
        ),
    ],
    experience=[
        ExperienceItem(
            company="Nexus Ai Digital",
            location="Faisalabad, Pakistan",
            role="Data Scientist & Machine Learning",
            duration="Sep 2025 – Nov 2025",
            bullets=[
                "Developed and deployed <b>AI/ML models</b> using traditional ML algorithms for real-world datasets.",
                "Performed data preprocessing, and exploratory data analysis with Pandas and MySQL.",
                "Applied <b>NLP techniques</b> for text classification, sentiment analysis, and natural language understanding."
            ]
        )
    ],
    education=[
        EducationItem(
            institute="National Textile University",
            location="Faisalabad, Pakistan",
            degree="Bachelor of Science in Computer Science",
            duration="Sep 2023 – Oct 2027"
        )
    ],
    projects=[
        ProjectItem(
            title="House Price Prediction",
            technologies=["Python", "Flask", "Scikit-learn", "ML"],
            date="July 2026",
            bullets=[
                "Built and deployed a Gradient Boosting Regression model in Scikit-learn to predict house prices from 21,000+ King County property records, achieving an R² of 0.92.",
                "Engineered and preprocessed features from property attributes such as location, living area, grade, and condition using Python, Pandas, and NumPy.",
                "Developed and deployed an interactive Flask web application with a Bootstrap 5 interface, allowing users to input property details and instantly view predicted prices."
            ]
        ),
        ProjectItem(
            title="Mobiles Sales Analysis",
            technologies=["Power Query", "Power BI", "DAX", "MySQL", "Excel"],
            date="April 2026",
            bullets=[
                "Perform required transformation on data to make it suitable for analysis using Power Query.",
                "Structure the dataset and model business transactions to perform SQL-based analysis on customer segmentation, retention patterns, and key buying behaviors.",
                "Build an interactive dashboard that highlights key patterns and trends using Power BI."
            ]
        ),
        ProjectItem(
            title="Banking-Credit-Risk-Loan-Portfolio-Dashboard",
            technologies=["Power BI", "MySQL", "Power Query", "Excel"],
            date="June 2026",
            bullets=[
                "Clean and transform 255,347 loan records using Power Query, handling null values and structuring data for credit risk analysis.",
                "Engineer DAX measures and calculated columns including Age Group segmentation, YoY default rate tracking, and total loan volume aggregations to model business risk scenarios.",
                "Build a 3-page interactive dashboard covering loan default trends, applicant demographics, and financial risk matrices, enabling stakeholders to identify high-risk borrower segments by employment type, income bracket, and credit score."
            ]
        )
    ],
    certifications=[
        CertificationItem(
            name="Python",
            url="https://www.kaggle.com/learn/certification/python"
        ),
        CertificationItem(
            name="Advance SQL",
            url="https://www.kaggle.com/learn/certification/advanced-sql"
        )
    ],
    ats_keywords_used=["Python", "SQL", "Power BI", "Machine Learning", "Data Analysis"],
    improvement_suggestions=ImprovementSuggestions(
        recommendations=[
            "Add AWS or Cloud deployment certification.",
            "Include Docker/containerization in project deployments.",
            "Expand GitHub portfolio with automated CI/CD pipelines.",
            "Build an end-to-end MLOps pipeline for house price prediction model.",
            "Obtain Microsoft Certified: Power BI Data Analyst Associate."
        ]
    )
)

print("Testing PDF Generation...")
pdf_path = generate_resume_pdf(metadata, rewritten_resume)
print(f"Success! PDF generated at: {pdf_path}")
