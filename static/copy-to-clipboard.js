//winotmk定制于2025.2.26
document.addEventListener('DOMContentLoaded', function () {
    // 获取所有 code 元素改为只获取 pre > code 子元素
    var codeBlocks = document.querySelectorAll('pre > code'); // 关键修改

	function createCopyIcon() {
			// ▶︎ 创建 SVG 容器
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
			svg.setAttribute('width', '24');
			svg.setAttribute('height', '24');
			svg.setAttribute('viewBox', '0 0 24 24');
			svg.setAttribute('fill', 'none');
			svg.setAttribute('stroke', 'currentColor');
			svg.setAttribute('stroke-width', '2');
			svg.setAttribute('stroke-linecap', 'round');
			svg.setAttribute('stroke-linejoin', 'round');
			svg.classList.add('icon', 'icon-tabler', 'icons-tabler-outline', 'icon-tabler-copy');

			// ▶︎ 创建第一个路径（底层透明层）
			const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path1.setAttribute('stroke', 'none');
			path1.setAttribute('d', 'M0 0h24v24H0z');
			path1.setAttribute('fill', 'none');

			// ▶︎ 创建第二个路径（矩形轮廓）
			const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path2.setAttribute('d', 'M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z');

			// ▶︎ 创建第三个路径（文档投影）
			const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			path3.setAttribute('d', 'M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1');

			// ▶︎ 组装结构
			svg.appendChild(path1);
			svg.appendChild(path2);
			svg.appendChild(path3);

			// ▶︎ 插入到目标容器（示例插入到 body 末尾）
			document.body.appendChild(svg);
		return svg;
	}

    for (var i = 0; i < codeBlocks.length; i++) {
        var codeBlock = codeBlocks[i];
        
        // 无需手动检查父元素，因为 querySelectorAll 已过滤
        var button = document.createElement('div');
        button.textContent = '';
        button.classList.add('copy-button');
		button.appendChild(createCopyIcon());
        
        // ▶▷ 插入到 pre 元素内而非 code 父级（优化定位准确度）
        codeBlock.parentNode.insertBefore(button, codeBlock.nextSibling);

        var clipboard = new ClipboardJS(button, {
            target: function (trigger) {
                return trigger.previousSibling;
            }
        });
        
        // 剩余原有事件绑定保持不变
        clipboard.on('success', function (e) {
            e.clearSelection();
            var notification = document.createElement('div');
            notification.textContent = 'Copied!';
            notification.classList.add('notification');
            document.body.appendChild(notification);
		
            setTimeout(function () {
                notification.style.opacity = '0';
                setTimeout(function () {
                    document.body.removeChild(notification);
                }, 500);
            }, 500);
        });
        clipboard.on('error', function (e) {
            console.error('复制失败:', e.action);
        });
    }
});