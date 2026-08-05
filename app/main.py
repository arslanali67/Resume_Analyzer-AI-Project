from pathlib import Path
from app.services.excel_exporter import export_to_excel
from app.services.ingest_folder import ingest_folder
from app.services.evaluator import evaluate_all_resumes


def main():

    try:

        resume_folder = "data/resumes"

        # Step 1: Index all resumes
        ingest_folder(resume_folder)


        # Step 2: Load Job Description
        job_description = Path(
            "data/job_descriptions/mearn_stack.txt"
        ).read_text(encoding="utf-8")

        # Step 3: Evaluate every resume
        results = evaluate_all_resumes(
            resume_folder,
            job_description,
        )

        # Step 4: Sort by match score (highest first)
        results.sort(
            key=lambda x: x["evaluation"].match_score,
            reverse=True,
        )

        # Step 5: Export to Excel
        export_to_excel(results)

        # Step 5: Print Leaderboard
        print("\n")
        print("=" * 80)
        print("TOP CANDIDATES")
        print("=" * 80)

        print(
            f'{"Rank":<6}{"Resume":<30}{"Score":<10}{"Recommendation"}'
        )

        print("-" * 80)

        for rank, result in enumerate(results, start=1):

            recommendation = result["evaluation"].hiring_recommendation

            # Keep only the first sentence
            recommendation = recommendation.split(".")[0]

            # Limit length for table display
            if len(recommendation) > 25:
                recommendation = recommendation[:25] + "..."

            print(
                f'{rank:<6}'
                f'{result["filename"]:<30}'
                f'{result["evaluation"].match_score:<10}'
                f'{recommendation}'
            )
        print("\n")

        # Step 6: Print Detailed Evaluation
        for rank, result in enumerate(results, start=1):

            print("=" * 80)
            print(f"Rank #{rank}")
            print(f"Resume: {result['filename']}")
            print("=" * 80)

            print(
                result["evaluation"].model_dump_json(
                    indent=4
                )
            )

            print()

    except Exception as e:

        print(f"Error: {e}")


if __name__ == "__main__":
    main()
