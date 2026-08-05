def clean_text(text):
    """This function clean the text extracted in previous step"""

    cleaned_lines=[]

    for line in text.splitlines():
        line = line.strip()

        if line:
            cleaned_lines.append(line)

    cleaned_text = "\n".join(cleaned_lines)        
    return cleaned_text            