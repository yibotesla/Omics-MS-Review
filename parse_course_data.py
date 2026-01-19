import re
import json
import os

input_file = "/home/ubuntu/course-knowledge-base/client/public/course_data.md"
output_file = "/home/ubuntu/course-knowledge-base/client/src/lib/course-data.json"

# 确保输出目录存在
os.makedirs(os.path.dirname(output_file), exist_ok=True)

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 解析Markdown内容为结构化数据
modules = []
current_module = None
current_section = None

# 按行处理
lines = content.split('\n')
i = 0
while i < len(lines):
    line = lines[i].strip()
    
    # 识别一级标题作为模块
    if line.startswith('# ') and not line.startswith('##'):
        title = line[2:].strip()
        # 跳过总标题
        if title == "课程知识点总结复习材料":
            i += 1
            continue
            
        current_module = {
            "id": f"module-{len(modules) + 1}",
            "title": title,
            "sections": [],
            "content": "" # 存储模块的简介内容
        }
        modules.append(current_module)
        current_section = None
        
    # 识别二级标题作为章节
    elif line.startswith('## ') and current_module:
        title = line[3:].strip()
        current_section = {
            "id": f"{current_module['id']}-section-{len(current_module['sections']) + 1}",
            "title": title,
            "content": ""
        }
        current_module['sections'].append(current_section)
        
    # 识别三级标题作为子章节（合并到当前章节内容中，但加粗显示）
    elif line.startswith('### ') and current_section:
        current_section['content'] += f"\n\n### {line[4:].strip()}\n\n"
        
    # 处理内容
    elif line and not line.startswith('---'):
        if current_section:
            current_section['content'] += line + "\n"
        elif current_module:
            current_module['content'] += line + "\n"
            
    i += 1

# 清理内容中的多余换行
for module in modules:
    module['content'] = module['content'].strip()
    for section in module['sections']:
        section['content'] = section['content'].strip()

# 写入JSON文件
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(modules, f, ensure_ascii=False, indent=2)

print(f"成功解析 {len(modules)} 个课程模块到 {output_file}")
