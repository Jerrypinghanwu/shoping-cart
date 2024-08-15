let iconCart = document.querySelector('.icon-cart'); 
let closeCart = document.querySelector('.close');
let body = document.querySelector('body'); //一旦按下購物車的圖示後，body 就會變成 showCart
let listProductHTML = document.querySelector('.listProduct');  //建議一個空的array 當JS load的時候
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let listProducts = []; // empty list array for json
let carts = []; //一個空的陣列，用來儲存購物車中的產品資料。用戶將產品添加到購物車時，這個陣列會存儲，產品資訊。

//點擊iconCart 顯示/隱藏購物車
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

/* 讓購物車交錯開啟跟關閉 */
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart') /* toggle('className') 這個方法在classList中，如果存在該類別則移除，否則添加如果body已經有showCart這個類別，toggle會移除它；如果沒有，則會添加*/
})

//addDataToHTML將listProducts中的產品，顯示在HTML中
const addDataToHTML = () => {
    listProductHTML.innerHTML = ''; //先清空listProductHTML容器的內容
    
    //如果listProducts有數據，遍歷每個物件，為每個產品，創建一個新的div
    if(listProducts.length>0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div'); 
            newProduct.classList.add('item'); //為新創建的div，添加item類別和內部的HTML結構，dataset是一個 DOM 屬性，用來存取HTML上所有data-*屬性，這些數據會以dataset物件的屬性形式存在。
            
            //加上這段，因為下方會偵測到點擊Add to Cart按鈕,但不知道是哪個被點擊
            newProduct.dataset.id = product.id; //將product.id的值，設置到newProduct元素的data-id屬性上，可以通過event.target.dataset.id來獲取data-id的值
            
            //將HTML結構，作為一個字符串直接插入到JavaScript中
            newProduct.innerHTML = 
            `
            <img src="${product.image}" alt="">  <!--${product.image} 依照圖片來顯示內容-->
                <h2>${product.name}</h2>
                <div class="price">
                    $${product.price}
                </div>
                <button class="addCart">
                    Add To cart
                </button>
            `;
            //newProduct會被添加到listProductHTML這個div元素
            listProductHTML.appendChild(newProduct);
        })
    }
}

// 點擊畫面上的 Add To Cart，會觸發addToCart函式，被點擊的元素，含addCart類別，則顯示提示框
listProductHTML.addEventListener('click',(event) => {
    let positionClick = event.target; //代表點擊的元素，就是「Add to cart」按鈕，event 可以是事件、事件發生的位置、觸發事件的元素...
    if(positionClick.classList.contains('addCart')){ //檢查點擊的元素是否是addCart按鈕，確認有沒有addCart類別
        let product_id = positionClick.parentElement.dataset.id; //得到按鈕的父元素，也就是包含這個按鈕的<div>，.dataset.id是取得父元素的data-id屬性值
        console.log('Product ID:', product_id); // 檢查 product_id 是否正確
        console.log(positionClick.parentElement.dataset.id);
        addToCart(product_id); //載入下方的函式，呼叫函式，將product_id加入購物車
        alert(`已經把 ${product_id} 加入購物車`); //提示框
    } 
})



//載入上方的內容，將選擇的產品（通過 product_id 來標識）添加到購物車中。
//將產品添加到carts陣列中，箭頭函式的語法是 (參數) => {函式內容}
const addToCart = (product_id) => 
    {
        console.log('listProducts:', listProducts);
        console.log('Searching for product_id:', product_id);
        //用在carts陣列中，查找特定產品的索引位置的代碼。為了檢查一個產品是否已經在購物車中，並找出其在carts陣列中的位置
        //findIndex()是JS陣列的一個方法，用來查找符合條件的第一個元素的索引。如果找到符合條件的元素，findIndex會返回該元素的索引；如果沒有找到，則返回-1
        /*positionThisProductInCart 用來檢查商品是否已經在購物車中的變數，儲存findIndex返回的結果，即產品在carts陣列中的索引。如果產品不存在於carts中，則 positionThisProductInCart會是-1。*/ 
        let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
        console.log('positionThisProductInCart:', positionThisProductInCart); // 確認位置值


        if(carts.length <= 0) //如果購物車是空的，則初始化購物車，並將第一個商品加入購物車
        {
            //carts 是一個陣列。陣列可以方便地存放多個商品，每個代表一個加入購物車的商品。
            carts = 
            [   
                {
                //為了把外部的變數值，存儲到物件的對應屬性中
                product_id: product_id, //第一個是屬性名，這個物件內部有一個名為product_id 的屬性。第二個是變數名。引用了在外部作用域（如函式或全局範圍）中已經存在的變數，表示要加入購物車的商品的ID。
                quantity: 1
                }
            ]; 
            console.log('Adding to cart:', cartItem);
        }

        // 商品不在購物車中，添加到購物車，使用push方法，將新商品物件加入到購物車陣列中
        else if(positionThisProductInCart < 0)
        {
            carts.push({
                product_id: product_id,
                quantity: 1
            });
        }

        // 如果 positionThisProductInCart 是一個非負數，這意味著這個商品已經在購物車中，增加數量
        else{
            carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
        }
        //測試用 console.log(carts);
        addCartToHTML();    
        addCartToMemory();//購物車的內容被記憶下來
    }


    //在localStorage.setItem調用中，carts是變數名稱，代表一個包含購物車資訊的陣列。carts是之前定義的，存放了購物車的內容。
const addCartToMemory = () =>{
    
    //cart是資料儲存的鍵名稱、carts是要儲存的實際資料內容
    //將carts陣列儲存到瀏覽器的本地儲存中。即使頁面重新載入，仍然被保留
    //localStorage 只能儲存字串。如果要儲存陣列或物件，需要先將它們轉換為字串格式
    localStorage.setItem('cart',JSON.stringify(carts)); 
}

/*addCartToHTML顯示購物車中的產品，清空listCartHTML內容，為每個購物車項目創建一個新的div
將產品資訊插入newCart中，並使用appendChild將其添加到listCartHTML中 */
const addCartToHTML = () => 
{
    listCartHTML.innerHTML = '';
    let totalQuantity = 0; //購物車icon顯示總共數量
    if(carts.length > 0){
        carts.forEach(cart => { 
            console.log('Cart item:', cart); // 輸出每個購物車項目的內容

            //cart是forEach的參數
            // console.log(cart); // 在這裡檢查 cart 的內容
            // console.log(listProducts);

            console.log('listProducts:', listProducts); // 確保 listProducts 內有正確的產品資料

            totalQuantity = totalQuantity + cart.quantity; // //購物車icon顯示總共數量
            let newCart = document.createElement('div'); // 創建一個新的 <div> 元素，表示購物車中的一個商品項目
            newCart.classList.add('item'); // 為新創建的 <div> 元素添加一個 'item' 類別

            //newCart 是一個變數，儲存了一個新創建的div
            newCart.dataset.id = cart.product_id; //將產品的product_id儲存在新創建的<div>元素的data-id中。好處是未來操作這個元素時，方便知道這個元素對應的是哪一個產品。
            console.log('cart.product_id:', cart.product_id);

            // positionProduct是變數，用來儲存listProducts陣列中某個產品的索引位置（index）
            //這個索引是由 findIndex 方法計算得到的。在listProducts一個包含所有產品的陣列，在這個陣列中，查找與購物車中商品相對應的產品資料
            console.log('listProducts:', listProducts); // 確保 listProducts 內有正確的產品資料

            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id); 
            console.log('positionProduct:', positionProduct); // 檢查找到的索引位置

            let info = listProducts[positionProduct]; // 使用查找到的索引來獲取產品的詳細資訊
            console.log(info);

            //.innerHTML是JS屬性，用來取得或設定一個HTML元素的內容。可以用來動態地，改變網頁上的內容
            // 為newCart這個<div>元素設定HTML內容，顯示商品圖片和其他資訊
            newCart.innerHTML = 
             `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    $${info.price * cart.quantity}  <!-- 計算多少錢 -->
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span> 
                </div>
            `;
            listCartHTML.appendChild(newCart); //appendChild 用來將新創建的元素，添加到現有的DOM中。動態地將內容插入到頁面中，實現產品清單和購物車的動態更新。
        })
    }
    iconCartSpan.innerText = totalQuantity; //購物車icon顯示總共數量
}


listCartHTML.addEventListener('click',(event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus'))
        {
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            //console.log(product_id);
            let type = 'minus';
            if(positionClick.classList.contains('plus')){
                type = 'plus';
            }
            changeQuantity(product_id,type);
        }
    })

const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >=0){
        //let info = carts[positionItemInCart]; 
        switch(type){
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
            default:
                let valueChange = carts[positionItemInCart].quantity -1;
                if(valueChange> 0){
                    carts[positionItemInCart].quantity=valueChange;
                }
                else{
                    carts.splice(positionItemInCart,1); //如果購物車的數量小於0就直接把他刪除掉
                }
            break;
        }    
    }
    addCartToMemory(); //再重新更新一次存儲記憶內容
    addCartToHTML(); //視窗也重新更新一次
}


//initApp用來從products.json文件中讀取產品數據，並將它們顯示在 HTML 中
const initApp = () => {
    // get data from json
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();
        //測試是否讀取到 json 檔案 
        //console.log(listProducts); 

        /*假設有資料，就讀取之前的資料*/
        if(localStorage.getItem('cart')){ //檢查localStorage中是否存在名為'cart' 的項目，getItem('cart')會返回儲存的字串（如果存在）; 如果不存在返回null
            
            //localStorage.getItem('cart') 取得儲存的字串
            //JSON.parse()可將其還原成原來的資料結構
            carts = JSON.parse(localStorage.getItem('cart')); 
            addCartToHTML(); //使用addCartToHTML()來更新頁面上的購物車顯示，使之前儲存的購物車內容，重新顯示
        }
    })
}
initApp();