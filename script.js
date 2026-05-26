// TODO: Thay thế bằng API Key của bạn lấy ở Bước 1
const API_KEY = "AIzaSyB1WPvgcgAgObkAKkCfMuckllJ2XC-tp0Y"; 

async function getRecipe() {
    const ingredients = document.getElementById('ingredients').value;
    const resultBox = document.getElementById('result');
    const loading = document.getElementById('loading');
    const recipeContent = document.getElementById('recipe-content');
    const dishName = document.getElementById('dish-name');

    if (!ingredients) {
        alert("재료를 입력해주세요! (Hãy nhập nguyên liệu!)");
        return;
    }

    // Hiện loading, ẩn kết quả cũ
    loading.classList.remove('hidden');
    resultBox.classList.add('hidden');

    // PROMPT CHÍNH (System Instruction)
    const promptText = `당신은 world's best chef입니다. 사용자가 가진 재료: "${ingredients}"를 기반으로 맛있는 요리 레시피를 하나 추천해주세요. 

요청 형식:
1. 요리 이름: [Tên món ăn]
2. 필요한 추가 재료: [Nếu cần thêm gì từ cửa hàng]
3. 조리법: [Cách nấu chi tiết, từng bước một]
4. 팁: [Mẹo nhỏ để món ăn ngon hơn]

언어: 한국어 (Tiếng Hàn)`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: promptText
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 1000,
                }
            })
        });

        const data = await response.json();
        
        if (data.error) {
            recipeContent.innerText = "오류가 발생했습니다: " + data.error.message;
        } else {
            const text = data.candidates[0].content.parts[0].text;
            
            // Xử lý tách title và content cho đẹp (đơn giản)
            // Giả định AI trả về text có định dạng như prompt đã request
            const lines = text.split('\n');
            if(lines.length > 0) dishName.innerText = lines[0].replace("1. 요리 이름: ", "");
            
            recipeContent.innerText = text;
        }

        loading.classList.add('hidden');
        resultBox.classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
        recipeContent.innerText = "네트워크 연결을 확인해주세요.";
        loading.classList.add('hidden');
        resultBox.classList.remove('hidden');
    }
}
