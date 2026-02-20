import re
import json

filepath = "public/assets/data/eigengrundstuecke.js"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Match the content between brackets
match = re.search(r"const eigengrundstuecke = (\[.*\]);", content, re.DOTALL)
if match:
    # Try parsing manually or by fixing JS to JSON string.
    # It's easier to capture individual object blocks and sort them.
    array_content = match.group(1)
    # Each object is exactly like: {\n        id: "flur-...",\n...\n    }
    # It might be comma-separated.
    
    # Split by the object boundary:
    blocks = re.split(r"(    \},\n    \{\n|    \}\n\])", content)
    
    # Alternatively, a safer regex per object:
    objects = re.findall(r"\{\s*id:\s*\"[^\"]+\",.*?\}", content, re.DOTALL)
    
    def get_num(s):
        m = re.search(r"name:\s*\"[^\d]+(\d+)\"", s)
        return int(m.group(1)) if m else 999999
    
    sorted_objs = sorted(objects, key=get_num)
    
    # Replace in file
    start_str = "const eigengrundstuecke = [\n    "
    end_str = "\n];\n"
    new_arr_content = ",\n    ".join(sorted_objs)
    
    new_content = re.sub(r"const eigengrundstuecke = \[.*?\];", start_str + new_arr_content + end_str, content, flags=re.DOTALL)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Sorted.")
    
else:
    print("Not found array")
