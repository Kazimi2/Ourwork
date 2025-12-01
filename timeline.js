/**
 * 时间轴页面交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化时间轴交互
    initTimelineInteractions();
    
    // 初始化图片放大功能
    initImageZoom();
    
    // 初始化滚动动画
    initScrollAnimations();
});

/**
 * 初始化时间轴交互功能
 */
function initTimelineInteractions() {
    const timelineCards = document.querySelectorAll('.timeline-card');
    
    timelineCards.forEach(card => {
        // 添加点击事件，显示/隐藏详细信息
        card.addEventListener('click', function(e) {
            // 防止点击标签或按钮时触发
            if (e.target.classList.contains('tag') || e.target.tagName === 'A') {
                return;
            }
            
            // 切换活动状态
            this.classList.toggle('active');
            
            // 如果卡片有活动状态，滚动到视图中心
            if (this.classList.contains('active')) {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        // 添加键盘支持
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
        
        // 设置可访问性属性
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', '点击查看详细信息');
    });
}

/**
 * 初始化图片放大功能
 */
function initImageZoom() {
    const timelineImages = document.querySelectorAll('.timeline-image img');
    
    timelineImages.forEach(img => {
        // 创建放大容器
        const container = img.parentElement;
        
        // 添加鼠标悬停效果
        container.addEventListener('mouseenter', function() {
            this.style.cursor = 'zoom-in';
        });
        
        container.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止触发卡片点击事件
            
            // 创建模态框
            createImageModal(img.src, img.alt);
        });
        
        // 添加键盘支持
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                createImageModal(img.src, img.alt);
            }
        });
        
        // 设置可访问性属性
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'button');
        container.setAttribute('aria-label', '点击放大图片');
    });
}

/**
 * 创建图片模态框
 */
function createImageModal(src, alt) {
    // 检查是否已存在模态框
    if (document.getElementById('image-modal')) {
        return;
    }
    
    // 创建模态框元素
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'image-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', '放大图片');
    
    // 创建模态框内容
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="关闭">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-image-container">
                <img src="${src}" alt="${alt}" class="modal-image">
                <div class="image-caption">${alt}</div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 添加样式
    addModalStyles();
    
    // 添加事件监听器
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // 添加键盘支持
    document.addEventListener('keydown', handleModalKeydown);
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 聚焦关闭按钮
    closeBtn.focus();
}

/**
 * 添加模态框样式
 */
function addModalStyles() {
    if (document.getElementById('modal-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            animation: zoomIn 0.3s ease;
        }
        
        @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            padding: 0.5rem;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: #3b82f6;
        }
        
        .modal-image-container {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .modal-image {
            max-width: 100%;
            max-height: 70vh;
            display: block;
        }
        
        .image-caption {
            padding: 1rem;
            background: white;
            color: #1e3a8a;
            text-align: center;
            font-weight: 500;
            border-top: 1px solid #e5e7eb;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                max-width: 95%;
            }
            
            .modal-close {
                top: -50px;
                right: 0;
                font-size: 1.5rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * 关闭模态框
 */
function closeModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
            
            // 移除键盘事件监听器
            document.removeEventListener('keydown', handleModalKeydown);
            
            // 移除样式
            const styles = document.getElementById('modal-styles');
            if (styles) {
                styles.remove();
            }
        }, 300);
    }
}

/**
 * 处理模态框键盘事件
 */
function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // 保持焦点在模态框内
    if (e.key === 'Tab') {
        const modal = document.getElementById('image-modal');
        if (modal) {
            const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    }
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // 观察每个时间轴项目
    timelineItems.forEach(item => {
        observer.observe(item);
    });
    
    // 添加动画样式
    if (!document.getElementById('timeline-animations')) {
        const style = document.createElement('style');
        style.id = 'timeline-animations';
        style.textContent = `
            .timeline-item {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .timeline-item.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .timeline-item:nth-child(odd).animate-in .timeline-card {
                animation: slideInRight 0.6s ease;
            }
            
            .timeline-item:nth-child(even).animate-in .timeline-card {
                animation: slideInLeft 0.6s ease;
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

/**
 * 处理图片加载错误
 */
function handleImageError(img) {
    // 如果图片加载失败，使用base64编码的SVG占位符
    if (!img.src.includes('base64')) {
        // 生成简单的占位图
        const placeholder = `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
                <rect width="400" height="250" fill="#1e3a8a"/>
                <text x="200" y="125" font-family="Arial" font-size="24" fill="white" text-anchor="middle">图片加载失败</text>
            </svg>
        `)}`;
        
        img.src = placeholder;
        img.alt = '图片加载失败，请检查网络连接';
    }
}

// 全局错误处理
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        handleImageError(e.target);
    }
}, true);
