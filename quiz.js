/**
 * 鸦片战争互动答题模块
 * 实现5-10道选择题，提交后显示得分与解析
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化答题模块
    initQuiz();
    
    // 初始化重置按钮
    initResetButton();
});

/**
 * 初始化答题模块
 */
function initQuiz() {
    const quizForm = document.getElementById('quiz-form');
    const submitBtn = document.getElementById('submit-quiz');
    
    if (!quizForm || !submitBtn) return;
    
    // 添加提交事件监听器
    submitBtn.addEventListener('click', handleQuizSubmit);
    
    // 为每个选项添加点击事件
    const options = quizForm.querySelectorAll('input[type="radio"]');
    options.forEach(option => {
        option.addEventListener('change', function() {
            // 移除之前的高亮
            const questionId = this.name;
            const questionContainer = document.getElementById(`question-${questionId}`);
            if (questionContainer) {
                questionContainer.classList.remove('answered-correct', 'answered-wrong');
            }
            
            // 显示解析按钮
            const showExplanationBtn = document.getElementById(`show-explanation-${questionId}`);
            if (showExplanationBtn) {
                showExplanationBtn.style.display = 'inline-block';
            }
        });
    });
    
    // 初始化显示解析按钮
    initExplanationButtons();
}

/**
 * 处理答题提交
 */
function handleQuizSubmit() {
    const quizForm = document.getElementById('quiz-form');
    const resultContainer = document.getElementById('quiz-results');
    const scoreDisplay = document.getElementById('score');
    const feedbackContainer = document.getElementById('answer-feedback');
    
    if (!quizForm || !resultContainer) return;
    
    // 获取所有问题
    const questions = quizData;
    let score = 0;
    let answeredCount = 0;
    let feedbackHTML = '';
    
    // 检查每个问题
    questions.forEach((question, index) => {
        const questionId = index + 1;
        const selectedOption = quizForm.querySelector(`input[name="q${questionId}"]:checked`);
        const questionContainer = document.querySelector(`.quiz-question:nth-child(${questionId})`);
        
        if (questionContainer) {
            // 移除之前的状态
            questionContainer.classList.remove('answered-correct', 'answered-wrong');
            
            if (selectedOption) {
                answeredCount++;
                
                // 检查答案是否正确
                const isCorrect = selectedOption.value === question.correctAnswer;
                
                if (isCorrect) {
                    score++;
                    questionContainer.classList.add('answered-correct');
                } else {
                    questionContainer.classList.add('answered-wrong');
                }
                
                // 显示正确答案
                highlightCorrectAnswer(questionId, question.correctAnswer);
                
                // 生成反馈
                feedbackHTML += `
                    <div class="question-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                        <h4>第${questionId}题: ${question.question}</h4>
                        <p>您的答案: ${selectedOption.value}. ${question.options[selectedOption.value]}</p>
                        <p>正确答案: ${question.correctAnswer}. ${question.options[question.correctAnswer]}</p>
                        <p class="explanation"><strong>解析:</strong> ${question.explanation}</p>
                    </div>
                `;
            } else {
                // 未作答
                feedbackHTML += `
                    <div class="question-feedback unanswered">
                        <h4>第${questionId}题: ${question.question}</h4>
                        <p class="unanswered-text">未作答</p>
                        <p>正确答案: ${question.correctAnswer}. ${question.options[question.correctAnswer]}</p>
                        <p class="explanation"><strong>解析:</strong> ${question.explanation}</p>
                    </div>
                `;
            }
        }
    });
    
    // 计算分数和百分比
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    
    // 更新分数显示
    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }
    
    // 更新反馈内容
    if (feedbackContainer) {
        feedbackContainer.innerHTML = feedbackHTML;
    }
    
    // 显示结果容器
    resultContainer.classList.remove('hidden');
    resultContainer.scrollIntoView({ behavior: 'smooth' });
    
    // 更新提交按钮状态
    const submitBtn = document.getElementById('submit-quiz');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '已提交';
    }
    
    // 显示未答题数量
    if (answeredCount < total) {
        const unanswered = total - answeredCount;
        const warning = document.createElement('div');
        warning.className = 'quiz-warning';
        warning.innerHTML = `<i class="fas fa-exclamation-triangle"></i> 您有 ${unanswered} 道题未作答，已按错误答案计分。`;
        
        // 移除之前的警告
        const oldWarning = resultContainer.querySelector('.quiz-warning');
        if (oldWarning) oldWarning.remove();
        
        resultContainer.insertBefore(warning, resultContainer.firstChild);
    }
}

/**
 * 高亮显示正确答案
 */
function highlightCorrectAnswer(questionId, correctAnswer) {
    const questionContainer = document.getElementById(`question-${questionId}`);
    if (!questionContainer) return;
    
    // 找到所有选项标签
    const labels = questionContainer.querySelectorAll('.option-label');
    
    labels.forEach(label => {
        const input = label.querySelector('input[type="radio"]');
        if (input && input.value === correctAnswer) {
            label.classList.add('correct-answer');
        }
    });
}

/**
 * 显示/隐藏解析
 */
function showExplanation(questionId, show = true) {
    const explanation = document.getElementById(`explanation-${questionId}`);
    if (explanation) {
        if (show) {
            explanation.style.display = 'block';
            explanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            explanation.style.display = 'none';
        }
    }
}

/**
 * 初始化解析按钮
 */
function initExplanationButtons() {
    // 为每个问题添加显示解析按钮
    quizData.forEach((question, index) => {
        const questionId = index + 1;
        const questionContainer = document.getElementById(`question-${questionId}`);
        
        if (questionContainer) {
            // 检查是否已存在按钮
            if (!document.getElementById(`show-explanation-${questionId}`)) {
                // 创建显示解析按钮
                const showBtn = document.createElement('button');
                showBtn.id = `show-explanation-${questionId}`;
                showBtn.className = 'btn-explanation';
                showBtn.innerHTML = '<i class="fas fa-lightbulb"></i> 查看解析';
                showBtn.style.display = 'none';
                
                showBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const explanation = document.getElementById(`explanation-${questionId}`);
                    if (explanation) {
                        const isHidden = explanation.style.display === 'none';
                        showExplanation(questionId, isHidden);
                        this.innerHTML = isHidden ? 
                            '<i class="fas fa-times"></i> 隐藏解析' : 
                            '<i class="fas fa-lightbulb"></i> 查看解析';
                    }
                });
                
                // 将按钮添加到问题容器
                const optionsContainer = questionContainer.querySelector('.quiz-options');
                if (optionsContainer) {
                    optionsContainer.appendChild(showBtn);
                }
            }
        }
    });
}

/**
 * 初始化重置按钮
 */
function initResetButton() {
    const resetBtn = document.getElementById('reset-quiz');
    if (!resetBtn) return;
    
    resetBtn.addEventListener('click', function() {
        resetQuiz();
    });
}

/**
 * 重置答题
 */
function resetQuiz() {
    const quizForm = document.getElementById('quiz-form');
    const resultContainer = document.getElementById('quiz-results');
    const submitBtn = document.getElementById('submit-quiz');
    const scoreDisplay = document.getElementById('score');
    const feedbackContainer = document.getElementById('answer-feedback');
    
    if (!quizForm) return;
    
    // 重置表单
    quizForm.reset();
    
    // 隐藏结果
    if (resultContainer) {
        resultContainer.classList.add('hidden');
    }
    
    // 重置提交按钮
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '提交答案';
    }
    
    // 重置分数显示
    if (scoreDisplay) {
        scoreDisplay.textContent = '0';
    }
    
    // 清空反馈内容
    if (feedbackContainer) {
        feedbackContainer.innerHTML = '';
    }
    
    // 移除所有高亮和状态
    const questionContainers = document.querySelectorAll('.quiz-question');
    questionContainers.forEach(container => {
        container.classList.remove('answered-correct', 'answered-wrong');
        
        // 移除正确答案高亮
        const labels = container.querySelectorAll('label');
        labels.forEach(label => {
            label.classList.remove('correct-answer');
        });
    });
    
    // 移除警告消息
    const warnings = document.querySelectorAll('.quiz-warning');
    warnings.forEach(warning => warning.remove());
    
    // 滚动到顶部
    const quizSection = document.getElementById('quiz');
    if (quizSection) {
        quizSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * 鸦片战争答题数据
 * 注意：这里只包含HTML中实际存在的5道题
 */
const quizData = [
    {
        question: "鸦片战争爆发于哪一年？",
        options: {
            A: "1839年",
            B: "1840年", 
            C: "1842年",
            D: "1856年"
        },
        correctAnswer: "B",
        explanation: "鸦片战争爆发于1840年6月，英国舰队抵达广东海面，正式发动战争。"
    },
    {
        question: "《南京条约》开放的通商口岸不包括？",
        options: {
            A: "上海",
            B: "广州", 
            C: "天津",
            D: "宁波"
        },
        correctAnswer: "C",
        explanation: "《南京条约》开放的五口通商口岸是广州、厦门、福州、宁波、上海。天津是在1860年《北京条约》中开放的。"
    },
    {
        question: "虎门销烟的主要负责人是谁？",
        options: {
            A: "道光皇帝",
            B: "林则徐",
            C: "关天培",
            D: "琦善"
        },
        correctAnswer: "B",
        explanation: "林则徐是虎门销烟的主要负责人，他于1839年6月在广东虎门海滩当众销毁鸦片。"
    },
    {
        question: "鸦片战争后割让给英国的是？",
        options: {
            A: "香港岛",
            B: "澳门",
            C: "台湾",
            D: "澎湖列岛"
        },
        correctAnswer: "A",
        explanation: "《南京条约》规定割让香港岛给英国，九龙半岛是在1860年《北京条约》中割让的。"
    },
    {
        question: "下列哪项不是《南京条约》的内容？",
        options: {
            A: "赔款2100万银元",
            B: "协定关税",
            C: "领事裁判权",
            D: "开设工厂权"
        },
        correctAnswer: "D",
        explanation: "《南京条约》主要内容包括：割让香港岛、赔款2100万银元、开放五口通商、协定关税等。开设工厂权是在后来的《马关条约》中规定的。"
    }
];

/**
 * 动态生成答题表单（如果需要）
 */
function generateQuizForm() {
    const quizContainer = document.getElementById('quiz-questions');
    if (!quizContainer) return;
    
    let html = '';
    
    quizData.forEach((question, index) => {
        const questionId = index + 1;
        
        html += `
            <div class="quiz-question" id="question-${questionId}">
                <h3>${questionId}. ${question.question}</h3>
                <div class="quiz-options">
        `;
        
        // 生成选项
        Object.entries(question.options).forEach(([key, value]) => {
            html += `
                <label class="option-label">
                    <input type="radio" name="q${questionId}" value="${key}" required>
                    <span class="option-text">${key}. ${value}</span>
                </label>
            `;
        });
        
        html += `
                </div>
                <div class="quiz-explanation" id="explanation-${questionId}" style="display: none;">
                    <div class="explanation-content">
                        <strong><i class="fas fa-info-circle"></i> 解析：</strong>
                        <p>${question.explanation}</p>
                        <p class="correct-answer-text">正确答案：${question.correctAnswer}</p>
                    </div>
                </div>
            </div>
        `;
    });
    
    quizContainer.innerHTML = html;
    
    // 重新初始化事件监听器
    initQuiz();
}

// 如果页面加载时没有答题表单，自动生成
if (!document.querySelector('.quiz-question')) {
    document.addEventListener('DOMContentLoaded', generateQuizForm);
}
