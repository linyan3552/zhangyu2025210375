// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化月份导航
    initMonthNavigation();
    // 初始化所有月份的书籍滑动
    initAllBookSliders();
    // 初始化分类导航
    initCategoryNavigation();
    // 为所有书籍添加编辑功能
    addEditFunctionalityToAllBooks();
    // 加载保存的书籍数据
    loadBookData();
});

// 从首页进入阅读记录
function enterReadingRecord() {
    const homepage = document.getElementById('homepage');
    const readingContent = document.getElementById('reading-content');
    
    // 完全移除首页元素
    homepage.remove();
    
    // 显示阅读记录内容
    readingContent.style.display = 'block';
}

// 开启新记录模态框
function openNewRecordPage() {
    document.getElementById('new-record-modal').style.display = 'block';
}

// 关闭新记录模态框
function closeNewRecordModal() {
    document.getElementById('new-record-modal').style.display = 'none';
}

// 保存新记录
function saveNewRecord() {
    const category = document.getElementById('book-category').value;
    const month = document.getElementById('book-month').value;
    const bookCard = document.querySelector('#new-record-modal .book-card');
    
    // 收集书籍数据
    const bookData = {
        title: bookCard.querySelector('.book-title').textContent.trim(),
        author: bookCard.querySelector('.editable-author-name').textContent.trim(),
        quotes: Array.from(bookCard.querySelectorAll('.book-quotes blockquote')).map(quote => quote.textContent.trim()),
        review: Array.from(bookCard.querySelectorAll('.book-review p')).map(p => p.textContent.trim())
    };
    
    // 验证必填项
    if (!bookData.title || !bookData.author) {
        alert('请填写书名和作者名');
        return;
    }
    
    // 生成唯一ID
    const recordId = 'record_' + Date.now();
    
    // 存储新记录
    localStorage.setItem(recordId, JSON.stringify({
        ...bookData,
        category,
        month,
        id: recordId
    }));
    
    alert('记录保存成功！');
    closeNewRecordModal();
    // 重新加载页面以显示新记录
    window.location.reload();
}

// 取消新记录
function cancelNewRecord() {
    if (confirm('确定要取消吗？未保存的内容将丢失。')) {
        closeNewRecordModal();
    }
}

// 添加点击外部关闭模态框的功能
document.addEventListener('click', function(event) {
    const modal = document.getElementById('new-record-modal');
    if (event.target === modal) {
        closeNewRecordModal();
    }
});

// 添加名言按钮功能
document.addEventListener('DOMContentLoaded', function() {
    // 监听模态框打开事件
    const modal = document.getElementById('new-record-modal');
    const openBtn = document.querySelector('.new-record-btn');
    
    openBtn.addEventListener('click', function() {
        // 延迟添加按钮，确保模态框已经显示
        setTimeout(function() {
            const quotesSection = document.querySelector('#new-record-modal .book-quotes');
            
            // 如果已经有添加按钮，就不再添加
            if (!quotesSection.querySelector('.add-quote-btn')) {
                // 添加"添加名言"按钮
                const addQuoteBtn = document.createElement('button');
                addQuoteBtn.className = 'add-quote-btn';
                addQuoteBtn.textContent = '添加名言';
                addQuoteBtn.onclick = function() {
                    const newQuote = document.createElement('blockquote');
                    newQuote.contentEditable = true;
                    newQuote.textContent = '请输入书中名言...';
                    quotesSection.appendChild(newQuote);
                };
                
                quotesSection.appendChild(addQuoteBtn);
            }
        }, 100);
    });
});

// 显示/隐藏搜索输入框
function showSearchInput() {
    const searchContainer = document.getElementById('search-container');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchContainer.style.display === 'none') {
        searchContainer.style.display = 'flex';
        searchBtn.style.display = 'none';
        document.getElementById('search-input').focus();
    } else {
        searchContainer.style.display = 'none';
        searchBtn.style.display = 'block';
        // 重置搜索
        resetSearch();
    }
}

// 搜索书籍
function searchBooks() {
    const searchTerm = document.getElementById('search-input').value.trim();
    
    if (!searchTerm) {
        alert('请输入书名');
        return;
    }
    
    // 移除书名号并转换为小写进行比较
    const cleanSearchTerm = searchTerm.replace(/《|》/g, '').toLowerCase();
    
    // 获取所有书籍卡片
    const allSlides = document.querySelectorAll('.book-slide');
    
    // 隐藏所有月份section
    const allSections = document.querySelectorAll('.month-section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    let found = false;
    
    // 遍历所有书籍卡片
    allSlides.forEach(slide => {
        const bookCard = slide.querySelector('.book-card');
        if (bookCard) {
            const bookTitle = bookCard.querySelector('.book-title').textContent.trim();
            // 移除书名号并转换为小写进行比较
            const cleanBookTitle = bookTitle.replace(/《|》/g, '').toLowerCase();
            
            if (cleanBookTitle.includes(cleanSearchTerm)) {
                // 显示包含该书籍的section
                const section = slide.closest('.month-section');
                section.style.display = 'block';
                
                // 显示该书籍卡片
                slide.style.display = 'block';
                slide.classList.add('active');
                
                found = true;
            } else {
                // 隐藏不匹配的书籍卡片
                slide.style.display = 'none';
            }
        }
    });
    
    if (!found) {
        alert('未找到匹配的书籍');
        resetSearch();
    }
}

// 重置搜索
function resetSearch() {
    // 清空搜索输入框
    document.getElementById('search-input').value = '';
    
    // 显示所有月份section
    const allSections = document.querySelectorAll('.month-section');
    allSections.forEach(section => {
        section.style.display = 'block';
    });
    
    // 显示所有书籍卡片
    const allSlides = document.querySelectorAll('.book-slide');
    allSlides.forEach(slide => {
        slide.style.display = 'block';
    });
    
    // 确保当前选中的section中的第一个书籍是显示的
    const activeSection = document.querySelector('.month-section.active');
    if (activeSection) {
        const activeSlide = activeSection.querySelector('.book-slide.active');
        if (!activeSlide) {
            const firstSlide = activeSection.querySelector('.book-slide');
            if (firstSlide) {
                firstSlide.classList.add('active');
            }
        }
    }
}

// 初始化月份导航功能
function initMonthNavigation() {
    const monthButtons = document.querySelectorAll('.month-btn');
    
    monthButtons.forEach(button => {
        button.addEventListener('click', function() {
            const month = this.getAttribute('data-month');
            
            // 移除所有按钮的active类
            monthButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加active类
            this.classList.add('active');
            
            // 获取当前激活的分类
            const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
            
            // 隐藏所有月份 section
            const allMonthSections = document.querySelectorAll('.month-section');
            allMonthSections.forEach(section => section.classList.remove('active'));
            
            // 显示对应分类和月份的 section
            const targetSection = document.getElementById(`${activeCategory}-month-${month}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// 初始化分类导航功能
function initCategoryNavigation() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    const monthButtons = document.querySelectorAll('.month-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // 移除所有分类按钮的active类
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的分类按钮添加active类
            this.classList.add('active');
            
            // 隐藏所有分类内容
            categoryContents.forEach(content => content.classList.remove('active'));
            // 显示对应的分类内容
            const targetContent = document.getElementById(`${category}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // 获取当前激活的月份
            const activeMonth = document.querySelector('.month-btn.active').getAttribute('data-month');
            
            // 隐藏所有月份 section
            const allMonthSections = document.querySelectorAll('.month-section');
            allMonthSections.forEach(section => section.classList.remove('active'));
            
            // 显示对应分类和月份的 section
            const targetSection = document.getElementById(`${category}-month-${activeMonth}`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// 初始化所有月份的书籍滑动
function initAllBookSliders() {
    // 遍历所有分类
    const categories = ['serious', 'other'];
    
    categories.forEach(category => {
        // 遍历所有月份
        for (let month = 1; month <= 12; month++) {
            // 重置每个月份的当前书籍索引
            window[`currentBook_${category}_${month}`] = 0;
            
            // 检查该月份是否存在书籍
            const slides = document.querySelectorAll(`#${category}-month-${month} .book-slide`);
            if (slides.length > 0) {
                // 初始化滑动指示器
                updateIndicators(month, 0, slides.length, category);
            }
        }
    });
}

// 切换到上一本书
function prevBook(month, category) {
    const slides = document.querySelectorAll(`#${category}-month-${month} .book-slide`);
    if (slides.length <= 1) return;
    
    let currentIndex = window[`currentBook_${category}_${month}`] || 0;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    
    showBook(month, currentIndex, category);
    window[`currentBook_${category}_${month}`] = currentIndex;
}

// 切换到下一本书
function nextBook(month, category) {
    const slides = document.querySelectorAll(`#${category}-month-${month} .book-slide`);
    if (slides.length <= 1) return;
    
    let currentIndex = window[`currentBook_${category}_${month}`] || 0;
    currentIndex = (currentIndex + 1) % slides.length;
    
    showBook(month, currentIndex, category);
    window[`currentBook_${category}_${month}`] = currentIndex;
}

// 显示指定索引的书籍
function showBook(month, index, category) {
    const slides = document.querySelectorAll(`#${category}-month-${month} .book-slide`);
    
    if (index >= slides.length || index < 0) return;
    
    // 隐藏所有书籍
    slides.forEach(slide => slide.classList.remove('active'));
    // 显示当前书籍
    slides[index].classList.add('active');
    
    // 更新指示器
    updateIndicators(month, index, slides.length, category);
}

// 更新滑动指示器
function updateIndicators(month, currentIndex, totalSlides, category) {
    const indicatorsContainer = document.getElementById(`${category}-indicators-${month}`);
    if (!indicatorsContainer) return;
    
    // 移除所有现有指示器
    indicatorsContainer.innerHTML = '';
    
    // 创建新的指示器
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('span');
        indicator.className = `indicator ${i === currentIndex ? 'active' : ''}`;
        indicator.addEventListener('click', () => {
            showBook(month, i, category);
            window[`currentBook_${category}_${month}`] = i;
        });
        indicatorsContainer.appendChild(indicator);
    }
}

// 切换编辑模式
function toggleEditMode(button) {
    // 找到当前书籍卡片
    const bookCard = button.closest('.book-card');
    
    // 获取所有可编辑元素
    const editableElements = bookCard.querySelectorAll('[contenteditable]');
    
    // 切换编辑模式
    // 先检查当前是否处于编辑模式
    const currentMode = editableElements[0].contentEditable;
    const newMode = currentMode === 'false' ? 'true' : 'false';
    
    // 应用新的编辑模式
    editableElements.forEach(element => {
        element.contentEditable = newMode;
        if (newMode === 'true') {
            element.classList.add('editing');
        } else {
            element.classList.remove('editing');
        }
    });
    
    // 更新按钮文本
    button.textContent = newMode === 'true' ? '取消编辑' : '编辑';
}

// 保存书籍数据到localStorage
function saveBookData(button) {
    // 找到当前书籍卡片
    const bookCard = button.closest('.book-card');
    const bookTitle = bookCard.querySelector('.book-title').textContent.trim();
    
    // 保存书籍数据
    const bookData = {
        title: bookCard.querySelector('.book-title').textContent.trim(),
        author: bookCard.querySelector('.editable-author-name').textContent.trim(),
        quotes: Array.from(bookCard.querySelectorAll('.book-quotes blockquote')).map(quote => quote.textContent.trim()),
        review: Array.from(bookCard.querySelectorAll('.book-review p')).map(p => p.textContent.trim())
    };
    
    // 使用书籍标题作为key存储数据
    localStorage.setItem(`book_${bookTitle}`, JSON.stringify(bookData));
    
    // 显示保存成功提示
    alert('书籍数据已保存！');
}

// 加载书籍数据
function loadBookData() {
    // 获取所有书籍卡片
    const bookCards = document.querySelectorAll('.book-card');
    
    // 加载原有格式的书籍数据
    bookCards.forEach(bookCard => {
        const bookTitle = bookCard.querySelector('.book-title').textContent.trim();
        const savedData = localStorage.getItem(`book_${bookTitle}`);
        
        if (savedData) {
            const bookData = JSON.parse(savedData);
            
            // 恢复数据
            bookCard.querySelector('.book-title').textContent = bookData.title;
            bookCard.querySelector('.editable-author-name').textContent = bookData.author;
            
            // 恢复名言
            const quoteElements = bookCard.querySelectorAll('.book-quotes blockquote');
            quoteElements.forEach((quote, index) => {
                if (bookData.quotes[index]) {
                    quote.textContent = bookData.quotes[index];
                }
            });
            
            // 恢复读后感
            const reviewElements = bookCard.querySelectorAll('.book-review p');
            reviewElements.forEach((p, index) => {
                if (bookData.review[index]) {
                    p.textContent = bookData.review[index];
                }
            });
        }
    });
    
    // 加载新格式的书籍记录
    loadNewFormatRecords();
    
    // 为新加载的书籍添加编辑功能
    addEditFunctionalityToAllBooks();
}

// 加载新格式的书籍记录
function loadNewFormatRecords() {
    // 遍历localStorage中的所有数据
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // 只处理新格式的记录（以'record_'开头）
        if (key.startsWith('record_')) {
            const recordData = JSON.parse(localStorage.getItem(key));
            
            // 查找对应的分类和月份的section
            const targetSection = document.getElementById(`${recordData.category}-month-${recordData.month}`);
            if (!targetSection) continue;
            
            // 查找书籍滑块容器
            let slider = targetSection.querySelector('.book-slider');
            if (!slider) continue;
            
            // 检查该记录是否已经存在
            let existingRecord = false;
            const existingCards = slider.querySelectorAll('.book-card');
            existingCards.forEach(card => {
                const title = card.querySelector('.book-title').textContent.trim();
                const author = card.querySelector('.editable-author-name').textContent.trim();
                if (title === recordData.title && author === recordData.author) {
                    existingRecord = true;
                }
            });
            
            // 如果记录不存在，则添加新的书籍卡片
            if (!existingRecord) {
                // 创建新的书籍卡片
                const newBookCard = createBookCard(recordData);
                
                // 创建新的书籍幻灯片
                const newSlide = document.createElement('div');
                newSlide.className = 'book-slide';
                newSlide.appendChild(newBookCard);
                
                // 添加到滑块容器
                slider.appendChild(newSlide);
                
                // 更新滑块指示器
                updateBookSlider(recordData.category, recordData.month);
            }
        }
    }
}

// 创建书籍卡片
function createBookCard(bookData) {
    // 创建书籍卡片元素
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    // 构建卡片内容
    bookCard.innerHTML = `
        <div class="book-cover"></div>
        <div class="book-info">
            <div class="edit-controls">
                <button class="edit-btn" onclick="toggleEditMode(this)">编辑</button>
                <button class="save-btn" onclick="saveBookData(this)">保存</button>
            </div>
            <h3 class="book-title" contenteditable="false">${bookData.title}</h3>
            <p class="book-author">
                作者：
                <span class="editable-author-name" contenteditable="false">${bookData.author}</span>
            </p>
            <div class="book-quotes">
                <h4>书中名言</h4>
                ${bookData.quotes.map(quote => `<blockquote contenteditable="false">${quote}</blockquote>`).join('')}
            </div>
            <div class="book-review">
                <h4>有感</h4>
                ${bookData.review.map(paragraph => `<p contenteditable="false">${paragraph}</p>`).join('')}
            </div>
        </div>
    `;
    
    return bookCard;
}

// 更新书籍滑块
function updateBookSlider(category, month) {
    const targetSection = document.getElementById(`${category}-month-${month}`);
    if (!targetSection) return;
    
    const slides = targetSection.querySelectorAll('.book-slide');
    const indicatorsContainer = document.getElementById(`${category}-indicators-${month}`);
    
    // 如果没有指示器容器，则创建一个
    if (!indicatorsContainer) {
        const slider = targetSection.querySelector('.book-slider');
        const indicatorsDiv = document.createElement('div');
        indicatorsDiv.className = 'indicators-container';
        indicatorsDiv.id = `${category}-indicators-${month}`;
        slider.appendChild(indicatorsDiv);
        
        // 更新指示器
        updateIndicators(month, 0, slides.length, category);
    } else {
        // 更新指示器
        updateIndicators(month, 0, slides.length, category);
    }
    
    // 重置当前书籍索引
    window[`currentBook_${category}_${month}`] = 0;
    
    // 确保第一本书籍显示
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === 0);
    });
}

// 为所有书籍自动添加编辑功能
function addEditFunctionalityToAllBooks() {
    // 获取所有书籍卡片
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(bookCard => {
        const bookInfo = bookCard.querySelector('.book-info');
        
        // 移除现有的编辑控件（如果有）
        const existingEditControls = bookInfo.querySelector('.edit-controls');
        if (existingEditControls) {
            existingEditControls.remove();
        }
        
        // 添加编辑和保存按钮
        const editControls = document.createElement('div');
        editControls.className = 'edit-controls';
        
        // 编辑按钮
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '编辑';
        editBtn.onclick = function() {
            toggleEditMode(this);
        };
        editControls.appendChild(editBtn);
        
        // 保存按钮
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = '保存';
        saveBtn.onclick = function() {
            saveBookData(this);
        };
        editControls.appendChild(saveBtn);
        
        // 将编辑控件添加到书籍信息的开头
        bookInfo.insertBefore(editControls, bookInfo.firstChild);
        
        // 为书籍标题添加可编辑属性，但默认不可编辑
        const title = bookCard.querySelector('.book-title');
        if (title) {
            title.setAttribute('contenteditable', 'false');
        }
        
        // 为作者信息添加特殊处理：只让作者名称可编辑，"作者："文本不可编辑
        const author = bookCard.querySelector('.book-author');
        if (author) {
            // 检查是否已经处理过作者信息
            if (!author.querySelector('.editable-author-name')) {
                // 获取作者文本内容
                const authorText = author.textContent;
                // 分离"作者："和实际作者名称
                const authorPrefix = '作者：';
                const authorName = authorText.substring(authorPrefix.length).trim();
                
                // 清空原有内容
                author.innerHTML = '';
                
                // 创建"作者："文本节点（不可编辑）
                const prefixText = document.createTextNode(authorPrefix);
                author.appendChild(prefixText);
                
                // 创建可编辑的作者名称元素，但默认不可编辑
                const editableAuthorName = document.createElement('span');
                editableAuthorName.className = 'editable-author-name';
                editableAuthorName.textContent = authorName;
                editableAuthorName.setAttribute('contenteditable', 'false');
                author.appendChild(editableAuthorName);
            }
        }
        
        // 为书中名言的内容添加可编辑属性，但默认不可编辑
        const quotes = bookCard.querySelectorAll('.book-quotes blockquote');
        quotes.forEach(quote => {
            quote.setAttribute('contenteditable', 'false');
        });
        
        // 为读后感的内容添加可编辑属性，但默认不可编辑
        const reviewParagraphs = bookCard.querySelectorAll('.book-review p');
        reviewParagraphs.forEach(paragraph => {
            paragraph.setAttribute('contenteditable', 'false');
        });
    });
}

// 添加平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 移除页面加载动画的透明度设置
document.body.style.opacity = '1';

window.addEventListener('load', function() {
    
    // 动态计算视口高度，避免被底部导航栏遮挡
    function setViewportHeight() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // 初始化设置
    setViewportHeight();
    
    // 窗口大小变化时重新设置
    window.addEventListener('resize', setViewportHeight);
});
