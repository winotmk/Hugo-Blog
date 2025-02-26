#!/bin/bash

# 遍历当前目录下所有的 .md 文件
for file in *.md; do
    if [ -f "$file" ]; then
        # 使用 sed 替换日期格式，只处理文件前 3 行
        # -i 表示直接修改文件
        # -E 使用扩展正则表达式
        # 只匹配 date: YYYY/MM/DD 格式，并将其转换为 date: YYYY-MM-DD
        sed -i -E '1,3s/date: ([0-9]{4})\/([0-9]{2})\/([0-9]{2})/date: \1-\2-\3/' "$file"
        echo "处理文件: $file"
    fi
done

echo "所有文件处理完成！"