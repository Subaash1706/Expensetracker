const body = document.querySelector('body')
const accordionButton = document.getElementById('accordionButton')
const arrow = document.getElementById('accordionArrow');
const expenseList = document.getElementById('dashExpenseList')
const htmlDate = document.getElementById('date')
const dropdownMenu = document.querySelectorAll('#filterBy');
const dropdownToggleButton = document.querySelector('#dropdownButton');
const navBarContainer = document.querySelector('#navBarContainer');
const offCanvasContainer = document.querySelector('#offcanvas');
const addAmountInput = document.querySelector('#addAmountInput');
const addAmountButton = document.querySelector('#addAmountButton');
const addAmountDate = document.querySelector('#addAmountDate');
const addAmountSource = document.querySelector('#addAmountSource');
const addAmountChooseButton = document.querySelector('#chooseCategoryButton')
const addAmountChooseLi = document.querySelectorAll('#chooseCategory');
const addAmountCloseButton = document.querySelector('#addAmountCloseButton');
const cardTotalAmount = document.querySelector('#cardTotalAmount');
const cardIncome = document.querySelector('#cardIncome');
const cardExpense = document.querySelector('#cardExpense');
const formModal = document.querySelector('#modal')
const btnDanger = 'btn-danger'
const btnSuccess = 'btn-success'
const bgDangerSubtle = 'bg-danger-subtle'
const bgSuccessSubtle = 'bg-success-subtle'

addAmountChooseLi.forEach(item=>{
    item.addEventListener('click',(e)=>{
        addAmountInput.classList.remove(bgDangerSubtle, bgSuccessSubtle)
        addAmountChooseButton.classList.remove(btnDanger, btnSuccess, 'btn-outline-secondary')
        e.target.classList.add('chosen');
        e.target.innerHTML === 'Expense' ? (addAmountInput.classList.add(bgDangerSubtle), addAmountChooseButton.classList.add(btnDanger)) : (addAmountInput.classList.add(bgSuccessSubtle), addAmountChooseButton.classList.add(btnSuccess))
    })
}
)

addAmountCloseButton.addEventListener('click',(e)=>e.preventDefault())

const expenseArrayHard = [] //Important array

// Date for Dashboard
const date=new Date();
htmlDate.classList.add('d-none','d-md-block')
const currentMonth =  Number(date.getMonth())+1 < 10 ? `0${Number(date.getMonth())+1}` : String(Number(date.getMonth()+1))
const today = `${
    Number(date.getDate()) < 10 ? `0${date.getDate()}` : String(date.getDate())
}-${currentMonth}
-${String(date.getFullYear())}`
htmlDate.innerHTML = `Expense/Income history as of: ${today}`

accordionButton.addEventListener('click',()=>{
    arrow.classList.toggle('activeArrow')
})

// Filters Expense/Income on Dashboard
dropdownMenu.forEach(item=>{
    item.addEventListener('click',(e)=>{
        dropdownToggleButton.classList.add('active')
        e.preventDefault();
        dropdownToggleButton.classList.contains('active') ? filterExpenseArray(e.target.innerHTML, expenseArrayHard) : filterExpenseArray(expenseArrayHard)
    })
})

function filterExpenseArray(targetValue, expenseArray){
    const filteredExpenseArray = (targetValue === 'All' ? expenseArrayHard : 
    (targetValue === 'Expense' ? expenseArray.filter(item=>item[0] === 'Expense') :
    expenseArray.filter(item=>item[0] === 'Income')));
    renderExpense(filteredExpenseArray)
   
}

// Checks whether the filter is ON and based on the condition, the array is being rendered on dashboard
dropdownToggleButton.addEventListener('click',(e)=>{
    if (!e.target.classList.contains('active')) {
        renderExpense(expenseArrayHard)        
    }
})
// Renders income/expense cards on dashboard dynamically 
function renderExpense(expenseArray){
    const currentMonthExpenseArray = [];
    expenseArray.forEach(item=>{
        if(item[2].split('-')[1] === currentMonth){
            currentMonthExpenseArray.push(item)
        }
    })
    expenseList.innerHTML = '';
    renderChart(currentMonthExpenseArray)
    currentMonthExpenseArray.forEach(arr => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card', 'd-flex', 'flex-column', 'mb-3','position-relative');
        const cardImage = document.createElement('img');
        cardImage.classList.add('position-absolute','end-0','me-md-3','top-25','me-3')
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-body', 'd-flex', 'flex-md-row', 'flex-column','flex-lg-row', 'justify-content-between');
        arr.forEach((item,index) => {
            const cardItem = document.createElement('div');
            if(index===0){
                cardImage.src = `./images/${item}.png`
            }

            cardItem.classList.add('card-text', 'col-12','col-md-2','mr-2');
            cardItem.textContent = item;
            cardContent.appendChild(cardItem);
            cardContent.appendChild(cardImage)
        });

        cardContainer.appendChild(cardContent);
        expenseList.appendChild(cardContainer);
    });
    renderCardAmounts(currentMonthExpenseArray);
}


function renderCardAmounts(currentMonthExpenseArray){
        let totalAmount = 0;
        let totalExpense = 0;
        let totalIncome = 0;
    if(currentMonthExpenseArray.length > 0){ 
        currentMonthExpenseArray.forEach(item=>{
            totalIncome += item[0]==='Income' ? Number(item[3]) : 0;
            totalExpense += item[0] === 'Expense' ? Number(item[3]) : 0;
        })
    } 
    totalAmount = totalIncome - totalExpense;
    validateCardTotalAmount(totalAmount, cardTotalAmount);
    function validateCardTotalAmount(totalAmount, cardTotalAmount){
        const cardParent = cardTotalAmount.parentElement;
        totalAmount >= 0 ? (
            cardTotalAmount.textContent = `₹${totalAmount.toLocaleString('en-IN')}`,
            cardTotalAmount.classList.remove('text-danger'),
            cardParent.classList.remove(bgDangerSubtle)
        ):(
            cardTotalAmount.textContent = `-₹${(totalAmount*-1).toLocaleString('en-IN')}`,
            cardTotalAmount.classList.add('text-danger'),
            cardParent.classList.add(bgDangerSubtle)
        )
    }
    cardIncome.textContent =  `₹${totalIncome.toLocaleString('en-IN')}`
    cardExpense.textContent =  `₹${totalExpense.toLocaleString('en-IN')}`
}


var myPieChart; // Declare a variable to hold the chart instance
function renderChart(chartArr) {
    if (myPieChart) {
        myPieChart.destroy(); // Destroy the previous chart instance
    }
    var ctx = document.getElementById('myPieChart').getContext('2d');
    const labelsArray = chartArr.map(item => item[1]);
    const dataArray = chartArr.map(item => item[3]);
    var data = {
        labels: labelsArray,
        datasets: [{
            backgroundColor: ['#dc3545', '#0d6efd', '#ffc107', '#198754', '#6f42c1'],
            data: dataArray,
            hoverOffset: 10
        }]
    };
    var config = {
        type: 'pie',    // Type of chart (pie chart in this case)
        data: data      // Data for the chart
    };
    myPieChart = new Chart(ctx, config); // Store the new chart instance
}

formModal.addEventListener('submit',(e)=>{ 
    if(!formModal.checkValidity() && !addAmountInput.classList.contains(bgDangerSubtle,bgSuccessSubtle)){
        e.preventDefault()
        formModal.classList.add('was-validated')
    }
    else{
        formModal.classList.remove('was-validated')
        const toPush = [ addAmountSource, addAmountDate, addAmountInput ]
        e.preventDefault();
        const indExpenseArr = [];
        addAmountChooseLi.forEach(item=>{
            if(item.classList.contains('chosen')){indExpenseArr.push(item.innerHTML); item.classList.remove('chosen'); addAmountInput.classList.remove(bgDangerSubtle,bgSuccessSubtle)}
            })
        addAmountInput.classList.remove(bgDangerSubtle, bgSuccessSubtle)
        addAmountChooseButton.classList.remove(btnDanger, btnSuccess)
        addAmountChooseButton.classList.add('btn-outline-secondary')
        toPush.forEach(item=>{indExpenseArr.push(item.value);item.value=''})
        expenseArrayHard.push(indExpenseArr)
        renderExpense(expenseArrayHard)  
    } 
})

// Handle image upload through Tesseract js
const fileInput = document.querySelector('#fileUpload')
const imgPreview  = document.getElementById('previewImg')
const imgModalBody = document.getElementById('imageModalFooter')
const scannedContent = document.getElementById('scannedContent')
const inputTypeSelect = document.getElementById('inputTypeSelect')
fileInput.addEventListener('change',()=>{
    const indFile = fileInput.files[0]
    const fr = new FileReader;
    fr.onloadend = ()=>{
        imgPreview.src = fr.result;
    }
    if(indFile){
      fr.readAsDataURL(indFile)  
      const scannerRow = document.createElement('div') 
      scannerRow.classList.add('row','text-center','mt-2','w-100')
      const scannerCol = document.createElement('div');
      scannerCol.classList.add('col', 'col-12');
      const scannerButton = document.createElement('button')
      scannerButton.classList.add('btn','btn-success')
      scannerButton.innerHTML = 'Scan for text'
      scannerCol.appendChild(scannerButton)
      scannerRow.appendChild(scannerCol)
      imgModalBody.appendChild(scannerRow)
      scannerButton.addEventListener('click',(e)=>{
        e.preventDefault();
        scannerButton.classList.add('disabled')
        scannerButton.innerHTML = '<span class="spinner spinner-border"></span>'
        const progressBarContainer = document.createElement('div')
        progressBarContainer.classList.add('progress','my-2')
        progressBarContainer.role = 'progressbar'
        const progressBar = document.createElement('div')
        progressBar.classList.add('bg-success','progress-bar','progress-bar-striped')
        const progressBarStatus = document.createElement('div')
        progressBarStatus.classList.add('lead')
        progressBarContainer.appendChild(progressBar)
        scannerCol.appendChild(progressBarContainer)
        scannerCol.appendChild(progressBarStatus)

        Tesseract.recognize(
            indFile,
            'eng',
            { logger: m => {
                progressBar.style.width = `${(m.progress) * 100}%`;
                progressBarStatus.innerHTML = m.status.charAt(0).toUpperCase() + m.status.slice(1)
                progressBarStatus.innerHTML === 'Recognizing text' && progressBar.style.width === '100%' ?
                (scannerCol.removeChild(progressBarContainer),scannerCol.removeChild(progressBarStatus), scannerButton.classList.add('visually-hidden'),scannerCol.innerHTML = '<a type="button" class="btn btn-success" id="revealButton" href="#scannedContentContainer">Reveal scanned content</a>') : null;
                document.getElementById('revealButton')? document.getElementById('revealButton').addEventListener('click',()=>{
                    scannedContent.classList.remove('visually-hidden')
                }):null;
            } }
          ).then(({ data: { text } }) => {
            scannedContent.textContent = text;
            const badgeArray = text.split(" ")
            const colorArray = ['primary','secondary','light','dark','danger','warning','info']
            const badgeDiv = document.createElement('div');
            badgeDiv.classList.add('w-100','p-2','bg-success-subtle','rounded')
            scannedContent.appendChild(badgeDiv);
            badgeArray.forEach(item=>{
                const badge = document.createElement('div')
                badge.classList.add('badge','p-2','m-2',`text-bg-${colorArray[Math.floor(Math.random()*7)]}`)
                badge.innerHTML = item;
                badgeDiv.appendChild(badge)
            })
            const badgeFormDiv = document.createElement('div');
            badgeFormDiv.classList.add('bg-success-subtle','mb-2','p-4','text-center')
            const reason = document.createElement('input')
            reason.classList.add('form-control')
            const amount = document.createElement('input')
            amount.setAttribute('type', 'number')
            amount.classList.add('form-control')
            const dateInp = document.createElement('input')
            dateInp.setAttribute('type','date')
            dateInp.classList.add('form-control','dateInp')
            const submitButton = document.createElement('button')
            submitButton.classList.add('btn','btn-success')
            submitButton.innerHTML = 'Submit'

            submitButton.addEventListener('click',(e)=>{
                const inpValueArray = [];
                e.preventDefault()
                console.log('submitted')
                inpValueArray.push(inputTypeSelect[inputTypeSelect.selectedIndex].value)
                inpArray.splice(1,0,inpArray.splice(2,1)[0])
                for(let i=0; i<inpArray.length - 1; i++){
                    inpValueArray.push(inpArray[i].value)
                }
                expenseArrayHard.push(inpValueArray);
                renderExpense(expenseArrayHard)

            })
            const inpArray = [reason, amount, dateInp, submitButton]
            let count = 0;
            // inpGrpButton.onclick = ()=>inpGrpButton.classList.add('clicked')
            // const inpGrpButton = document.querySelectorAll('.inpGrpButton')

            inpArray.forEach((item,idx)=>{
                const inpGrp = document.createElement('div')
                inpGrp.classList.add('input-group','my-2');
                const inpGrpButton = document.createElement('button')
                inpGrpButton.classList.add('btn','btn-outline-success','inpGrpButton')
                inpGrpButton.setAttribute('data-bs-toggle','button')
                inpGrpButton.innerHTML = 'OK'
                // inpGrpButton.addEventListener('click',()=>{console.log(count);item.classList.contains('active') ? count += 1 : null})
                if(idx < 3){
                    inpGrp.appendChild(item)
                    inpGrp.appendChild(inpGrpButton)
                    badgeFormDiv.appendChild(inpGrp)
                }else{
                   badgeFormDiv.appendChild(item) 
                }
                
            })
            scannedContent.appendChild(badgeFormDiv)
            document.querySelectorAll('.badge').forEach((item)=>{
                item.addEventListener('click',(e)=>{
                    let upd = '';
                    let updated = '';
                    count += 1;
                    console.log(count)
                    count === 3? (upd = e.target.innerHTML.split('-'), updated = `${upd[2]}-${upd[1]}-${upd[0]}`, inpArray[2].value = updated) : inpArray[count-1].value = e.target.innerHTML
                    badgeDiv.removeChild(e.target)
                })
            })
            
          })
      })
    }
})



export {expenseArrayHard}