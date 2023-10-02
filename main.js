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
const chartText = document.getElementById('chartContainertext')
const formModal = document.querySelector('#modal')
const resetArrow = document.getElementById('resetArrow')
const resetButtons = document.querySelectorAll('#resetButtons>button')
const btnDanger = 'btn-danger'
const btnSuccess = 'btn-success'
const bgDangerSubtle = 'bg-danger-subtle'
const bgSuccessSubtle = 'bg-success-subtle'
const darkSwitch = document.getElementById('switch')
const dueForm = document.querySelector('#dueForm')
const dueDropdown = document.querySelector('#dpdMenu')


darkSwitch.addEventListener('click', ()=>{
    if(darkSwitch.checked) body.setAttribute('data-theme','dark')
    else body.removeAttribute('data-theme')
})

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
chartText.textContent = 'Chart appears here'
// Date for Dashboard
const date=new Date();
htmlDate.classList.add('d-none','d-md-block')
const currentMonth =  Number(date.getMonth())+1 < 10 ? `0${Number(date.getMonth())+1}` : String(Number(date.getMonth()+1))
const today = `${
    Number(date.getDate()) < 10 ? `0${date.getDate()}` : String(date.getDate())}-${currentMonth}-${String(date.getFullYear())}`
htmlDate.innerHTML = `Expense/Income history as of: ${today}`


const expenseArrayHard = (JSON.parse(localStorage.getItem('expenseArray'))) || [] //Important array
// expenseArrayHard.length > 0 ? (renderExpense(renderObject(expenseArrayHard))) : renderExpense(renderObject(expenseArrayHard))
renderExpense(renderObject(expenseArrayHard))


function renderObject(expenseArrayHard){
    expenseArrayKeys = ['type', 'reason', 'date', 'amount'];
    const expenseObjArray = [];
    expenseArrayHard.forEach((item)=>{
        expenseObj = {};
        expenseArrayKeys.forEach((key,index)=>{
            expenseObj[key] = item[index];
        
        })
        expenseObjArray.push(expenseObj)
    })
    return expenseObjArray
}


accordionButton.addEventListener('click',()=>{
    arrow.classList.toggle('activeArrow')
})

// Filters Expense/Income on Dashboard
dropdownMenu.forEach(item=>{
    item.addEventListener('click',(e)=>{
        dropdownToggleButton.classList.add('active')
        e.preventDefault();
        filterExpenseArray(e.target.innerHTML , expenseArrayHard)
    })
})

function filterExpenseArray(targetValue, expenseArray){
    const filteredExpenseArray = (targetValue === 'All' ? expenseArray : 
    (targetValue === 'Expense' ? expenseArray.filter(item=>item[0] === 'Expense') :
    expenseArray.filter(item=>item[0] === 'Income')));
    renderExpense(renderObject(filteredExpenseArray))
   
}

// Checks whether the filter is ON and based on the condition, the array is being rendered on dashboard
dropdownToggleButton.addEventListener('click',(e)=>{
    if (!e.target.classList.contains('active')) {
        renderExpense(renderObject(expenseArrayHard))       
    }
})

function obtainDateInfo(date, lookFor){
    switch(lookFor){
        case 'month':
            return new Date(date).getMonth();
        case 'year': 
            return new Date(date).getFullYear();
        case 'day': 
            return new Date(date).getDate();
        default: 
            return new Date(date);
    }
}
function getMonthName(date){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug","Sep", "Oct", "Nov", "Dec"];
    const monthName = obtainDateInfo(date, 'month');
    return months[+monthName];
}
function filterByCurrentMonthandYear(expenseArray){
    return expenseArray.filter((item)=> +obtainDateInfo(item.date, 'month')+1 === +currentMonth && obtainDateInfo(item.date, 'year')===new Date().getFullYear());
}
function convertObjtoArr(currentMonthExpenseArrayObj){
    const currentMonthExpenseArray = [];
        currentMonthExpenseArrayObj.forEach((expenseObj)=>{
            const arr = [];
            for(const key in expenseObj){
                arr.push(expenseObj[key])
            }
            currentMonthExpenseArray.push(arr)
        })
        return currentMonthExpenseArray;
}
function renderExpense(expenseArray){
    const currentMonthExpenseArrayObj =  filterByCurrentMonthandYear(expenseArray)
    const currentMonthExpenseArray = convertObjtoArr(currentMonthExpenseArrayObj)
    if(currentMonthExpenseArrayObj.length > 0){
        expenseList.innerHTML = '';
        currentMonthExpenseArrayObj.forEach((obj, index)=>{
            const cardContainer = document.createElement('div');
            cardContainer.classList.add('card','mb-2', 'mx-0','mx-md-2');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'd-flex', 'justify-content-between', 'align-items-center');
            cardBody.setAttribute('id', 'dashCardBody')
            const reasonAndDate = document.createElement('div');
            reasonAndDate.classList.add('v-stack');
            const reason = document.createElement('div');
            reason.setAttribute('id', 'dashBoardReason');
            reason.textContent = obj.reason;
            reasonAndDate.appendChild(reason);
            const date = document.createElement('div');
            
            const objDate = obtainDateInfo(obj.date, 'day');
            date.textContent = `${+objDate > 10 ? objDate : `0${objDate}`} ${getMonthName(obj.date)}`
            date.setAttribute('id', 'dashBoardMonth');
            reasonAndDate.appendChild(date);
            cardBody.appendChild(reasonAndDate);
            const amountContainer = document.createElement('div');
            amountContainer.setAttribute('id', 'amountContainer')
            const amount = document.createElement('div');
            amount.classList.add( obj.type === 'Income' ? 'text-success' : 'text-danger', 'dashBoardAmount' );
            amount.textContent = `₹${obj.amount}`;
            amountContainer.appendChild(amount);
            amountContainer.classList.add('d-flex', 'flex-row', 'justify-content-center', 'align-items-center')
            const dotVertical = document.createElement('button')
            dotVertical.classList.add('border-0','bg-light-subtle','position-absolute', 'end-0');
            dotVertical.setAttribute('id', 'moreButton');
            dotVertical.setAttribute('data-bs-toggle', 'dropdown');
            dotVertical.setAttribute('data-bs-target', `#dashBoardDropdownmenu-${index}`)
            dotVertical.innerHTML = `<span class="material-symbols-outlined align-middle">more_vert</span>`;
            // Edit/Remove logic
            const dropDownMenu = document.createElement('ul')
            dropDownMenu.classList.add('dropdown-menu','position-absolute','top-0');
            dropDownMenu.setAttribute('id', `dashBoardDropdownMenu-${index}`)
            const dropDownItemKeys = ['Edit description', 'Edit amount', 'Delete'];
            for(let i =0; i< dropDownItemKeys.length; i++){
                const dropDownItem = document.createElement('li');
                dropDownItem.classList.add('dropdown-item');
                dropDownItem.textContent = dropDownItemKeys[i];
                dropDownItem.setAttribute('id', 'dashBoardDropdownItem');
                dropDownMenu.appendChild(dropDownItem)
            }
            amountContainer.appendChild(dotVertical);
            amountContainer.appendChild(dropDownMenu);
            cardBody.appendChild(amountContainer);
            cardContainer.appendChild(cardBody);
            expenseList.appendChild(cardContainer);
        })
    }
    else{
        expenseList.innerHTML =  '';
        const noItems = document.createElement('p');
        noItems.innerHTML = 'No Expense/Income record for the current month';
        expenseList.appendChild(noItems)
    }
    renderChart(currentMonthExpenseArray)
    renderCardAmounts(currentMonthExpenseArray)
}

const cardbody = document.querySelectorAll('#dashExpenseList');
cardbody.forEach((item)=>{
    item.addEventListener('click', (e)=>{
        if(e.target.textContent === 'Edit amount'){
            const ul = e.target.parentElement;
            const targetId = +(ul.id.split('-')[1]);
            const amountField = (ul.parentElement).firstChild;
            amountField.setAttribute('contenteditable', 'true');
            const currentExpenseArray = convertObjtoArr(filterByCurrentMonthandYear(renderObject(expenseArrayHard)))
            const currentMonthIndex = expenseArrayHard.length - currentExpenseArray.length
            const targetIndex = currentMonthIndex + targetId
            amountField.addEventListener('keypress', (e)=>{
                if(e.key === 'Enter'){
                    e.preventDefault();
                    const changedValue = e.target.textContent[0] === '₹' ? ((e.target.textContent).split('₹'))[1] : e.target.textContent;
                    amountField.removeAttribute('contenteditable');
                    const existingValue = expenseArrayHard[targetIndex];
                    existingValue.splice(3,1, changedValue);
                    expenseArrayHard.splice(targetIndex, 1, existingValue);
                    updateLocalstorage(expenseArrayHard, 'expense')
                }
            })
    }
        else if(e.target.textContent === 'Edit description'){
            const ul = e.target.parentElement;
            const targetId = +(ul.id.split('-')[1]);
            const descriptionField = (ul.parentElement).previousSibling.firstChild;
            descriptionField.setAttribute('contenteditable', 'true');
            const currentExpenseArray = convertObjtoArr(filterByCurrentMonthandYear(renderObject(expenseArrayHard)))
            const currentMonthIndex = expenseArrayHard.length - currentExpenseArray.length
            const targetIndex = currentMonthIndex + targetId
            descriptionField.addEventListener('keypress', (e)=>{
                if(e.key==='Enter'){
                    e.preventDefault();
                    const changedDesc = e.target.textContent;
                    descriptionField.removeAttribute('contenteditable');
                    const existingDesc = expenseArrayHard[targetIndex];
                    existingDesc.splice(1,1,changedDesc);
                    expenseArrayHard.splice(targetIndex, 1, existingDesc)
                    updateLocalstorage(expenseArrayHard, 'expense')
                }
            })
        }
        else if(e.target.textContent === 'Delete'){
            const ul = e.target.parentElement;
            const targetId = +(ul.id.split('-')[1]);
            const currentExpenseArray = convertObjtoArr(filterByCurrentMonthandYear(renderObject(expenseArrayHard)))
            const currentMonthIndex = expenseArrayHard.length - currentExpenseArray.length
            const targetIndex = currentMonthIndex + targetId;
            expenseArrayHard.splice(targetIndex, 1)
            updateLocalstorage(expenseArrayHard, 'expense')
        }
})
})

// Rendering appropriate cards from the stored expense array
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
    chartText.innerHTML = '';
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
        renderExpense(renderObject(expenseArrayHard))  
        updateLocalstorage(expenseArrayHard, 'expense')
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
                renderExpense(renderObject(expenseArrayHard))
                updateLocalstorage(expenseArrayHard, 'expense')

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

dueDropdown.addEventListener('click', (e)=>{
    if(e.target.id === 'everyMonth'){
        dueDropdown.classList.add('selected');
    }
})

const dueObjArr = JSON.parse(localStorage.getItem('dueArray')) || [];
const dueCardContainer = document.querySelector('#dueCardSubContainer')
dueForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(dueForm);
    const fObj = Object.fromEntries(fd);
    dueObjArr.push(fObj);
    dueForm.reset();
    fObj['dateDifference'] = +findDaysDifference(fObj.dueDate);
    !dueDropdown.classList.contains('selected') ? fObj['reminder'] = 'once' : (fObj['reminder'] = 'every_month', dueDropdown.classList.remove('selected'));
    updateLocalstorage(dueObjArr, 'due');
    // renderDueCards(dueObjArr)
})
function renderDueCards(dueObjArr){
    dueCardContainer.innerHTML = '';
    dueObjArr.forEach((obj, index)=>{
        const dueCard = document.createElement('div');
        dueCard.classList.add('col','col-5','v-stack','rounded-2','border','p-2','m-2');
        dueCard.setAttribute('id', index)
        const dueDetailsContainer = document.createElement('div');
        dueDetailsContainer.classList.add('d-flex','flex-column', 'justify-content-center', 'align-items-center', 'pb-1');
        dueCard.appendChild(dueDetailsContainer)
        for(const key in obj){
            const dueDetails = document.createElement('div')
            if(key==='due' || key==='dueDate'){
                if(key === 'dueDate'){
                    dueDetails.style = 'color: #808080; font-size: 0.75rem;'
                    const dateValidation = +obtainDateInfo(obj[key], 'day') < 10 ? `0${obtainDateInfo(obj[key], 'day')}` : obtainDateInfo(obj[key], 'day')
                    dueDetails.textContent = `${dateValidation} ${getMonthName(obj[key])} ${obtainDateInfo(obj[key], 'year')}`
                    dueDetailsContainer.appendChild(dueDetails)
                }
                else if(key==='due'){
                    dueDetails.textContent = obj[key];
                    dueDetailsContainer.appendChild(dueDetails)
                }  
            }
            else if(key === 'dateDifference'){
                const diffSpan = document.createElement('span');
                diffSpan.textContent = ` (${obj[key] >= 0 ? `${Math.ceil(obj[key])} ${Math.ceil(obj[key]) > 1 ? 'days' : 'day'}` : `due past ${Math.floor(Math.abs(obj[key]))} ${Math.floor(Math.abs(obj[key])) > 1 ? 'days' : 'day'}`})`
                dueDetailsContainer.lastChild.appendChild(diffSpan)
                if(+obj[key] < 15 && +obj[key] > 5){
                    dueCard.style.backgroundColor = '#FDFFAE'
                }
                else if(+obj[key] < 5 && +obj[key] > 0){
                    dueCard.style.backgroundColor = '#FFD3B0'
                }
                else if(+obj[key] < 0){
                    dueCard.style.backgroundColor = '#FF6969'
                }
            }
            else if(key==='dueAmount'){
                dueDetails.classList.add('text-center','display-5')
                dueDetails.textContent = `₹${obj[key]}`;
                dueCard.appendChild(dueDetails);
                const dueDoneButton = document.createElement('button');
                dueDoneButton.classList.add('col','col-6', 'my-1', 'text-success');
                dueDoneButton.style = 'background-color: rgba(255, 255, 255, 0); border: none; outline: none'
                const dueDeleteButton = document.createElement('button');
                dueDeleteButton.classList.add('col', 'col-6', 'text-danger', 'my-1')
                dueDeleteButton.style = 'background-color: rgba(255, 255, 255, 0); border: none; outline: none';
                dueDeleteButton.innerHTML = '<span class="material-symbols-outlined align-middle">delete</span>'
                dueDoneButton.innerHTML = '<span class="material-symbols-outlined align-middle">done</span>'
                dueDoneButton.onclick = (e)=>{
                    dueCard.removeChild(dueDeleteButton);
                    dueCard.removeChild(dueDoneButton);
                    dueCard.style.backgroundColor = '#C8E4B2';
                    const dueComplete = document.createElement('button');
                    dueComplete.style = 'background-color: rgba(255, 255, 255, 0); border: none; outline: none';
                    dueComplete.classList.add('col-12');
                    dueComplete.innerHTML = '<span class="material-symbols-outlined align-middle text-info">add</span>';
                    dueCard.appendChild(dueComplete)
                    dueComplete.onclick = (e)=>{
                        const dueArr = [];
                        for(let key in obj){
                            dueArr.push(obj[key])
                        }
                        console.log(dueArr)
                        dueArr.pop() && dueArr.pop() && dueArr.unshift('Expense');
                        const updatedDueArr = dueArr
                        updatedDueArr.push(...updatedDueArr.splice(2,1))
                        expenseArrayHard.push(updatedDueArr);
                        updateLocalstorage(expenseArrayHard,'expense');
                        if(obj['reminder']==='every_month'){
                            const dueNowDate = new Date()
                            const updatedMonth = new Date(`${dueNowDate.getFullYear()}-${+dueNowDate.getMonth()+2}-${dueNowDate.getDate()}`)
                            obj['dueDate'] = updatedMonth;
                            obj['dateDifference'] = findDaysDifference(updatedMonth);
                            dueObjArr.push(obj)
                            removeCard(e);
                            updateLocalstorage(dueObjArr, 'due');
                            // renderDueCards(dueObjArr)
                        }
                        else removeCard(e) 
                        // removeCard(e);//coditionally remove
                    }
                }
                dueDeleteButton.onclick = (e)=>{removeCard(e)}
                function removeCard(e){
                    const parent = e.target.parentElement;
                    const cardElement = parent.parentElement;
                    dueObjArr.splice(cardElement.id, 1);
                    updateLocalstorage(dueObjArr, 'due')
                    // renderDueCards(dueObjArr)
                }
                dueCard.appendChild(dueDoneButton)
                dueCard.appendChild(dueDeleteButton)
            }
        }
        dueCardContainer.appendChild(dueCard)
    }) 
}
renderDueCards(dueObjArr)

function findDaysDifference(targetDate){
    const today = new Date()
    const target = new Date(targetDate)
    const difference = (target-today) / ( 1000 * 60 * 60 * 24 )
    return difference;
}
function updateLocalstorage(array, type){
    switch(type){
        case 'expense':
            localStorage.setItem('expenseArray',JSON.stringify(array))
            renderExpense(renderObject(array))
            break;
        case 'due': 
            localStorage.setItem('dueArray', JSON.stringify(array));
            renderDueCards(array);
            break;
    }
      
}   

resetButtons.forEach(item=>{
    item.addEventListener('click',(e)=>{
        e.target.innerHTML === 'Yes' ? (localStorage.removeItem('expenseArray'),renderExpense(expenseArrayHard),location.reload()) : null
    })
})
