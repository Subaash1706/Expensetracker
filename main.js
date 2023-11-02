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
const groupButton = document.querySelector('#groupButton')
const cardbody = document.querySelectorAll('#dashExpenseList');

// darkSwitch.addEventListener('click', ()=>{
//     if(darkSwitch.checked) body.setAttribute('data-theme','dark')
//     else body.removeAttribute('data-theme')
// })


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
chartText.textContent = 'Chart appears here' //FALBACK TEXT FOR CHART CONTAINER

// REUSABLE DATE OBJECT
const date=new Date();
htmlDate.classList.add('d-none','d-md-block')
const currentMonth =  Number(date.getMonth())+1 < 10 ? `0${Number(date.getMonth())+1}` : String(Number(date.getMonth()+1))
const today = `${Number(date.getDate()) < 10 ? `0${date.getDate()}` : String(date.getDate())}-${currentMonth}-${String(date.getFullYear())}`
htmlDate.innerHTML = `Expense/Income history as of: ${today}`


const expenseArrayHard = (JSON.parse(localStorage.getItem('expenseArray'))) || [] //ACTUAL EXPENSE/INCOME ARRAY TO BE RENDERED

function sortedExpenseArray(expenseArrayHard){
    return expenseArrayHard.sort((obj1, obj2)=>new Date(obj1[2]) - new Date(obj2[2]))
}

renderExpense(renderObject(expenseArrayHard)) //FUNCTION CALLED TO RENDER EXPENSE/INCOME DYNAMICALLY

//FUNCTION TO CONSTRUCT AN OBJECT OUT OF THE STORED ARRAY
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

// LOGIC TO IDENTIFY THE TYPE OF FILTER ACTION TO BE PERFORMED
dropdownMenu.forEach(item=>{
    item.addEventListener('click',(e)=>{
        dropdownToggleButton.classList.add('active')
        e.preventDefault();
        filterExpenseArray(e.target.innerHTML , expenseArrayHard)
    })
})

//FILTER LOGIC
function filterExpenseArray(targetValue, expenseArray){
    const filteredExpenseArray = (targetValue === 'All' ? expenseArray : 
    (targetValue === 'Expense' ? expenseArray.filter(item=>item[0] === 'Expense') :
    expenseArray.filter(item=>item[0] === 'Income')));
    renderExpense(renderObject(filteredExpenseArray))
}

// CHECKS FOR THE TRUTHINESS OF THE FILTER BUTTON AND RENDERS APPROPRIATE DATA ON THE DASHBOARD
dropdownToggleButton.addEventListener('click',(e)=>{
    if (!e.target.classList.contains('active')) {
        renderExpense(renderObject(expenseArrayHard))       
    }
})

// FUNCTION THAT RETURNS DYNAMIC DATE INFO
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

// FUNCTION TO THE NAME OF THE MONTH
function getMonthName(date){
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug","Sep", "Oct", "Nov", "Dec"];
    const monthName = obtainDateInfo(date, 'month');
    return months[+monthName];
}

// FILTERS THE CURRENT MONTH ENTRIES FROM THE OVERALL STORED EXPENSE/INCOME ARRAY
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

// FUNCTION TO RENDER THE EXPENSE/INCOME DATA DYNAMICALLY ON THE DASHBOARD
function renderExpense(expenseArray){
    const currentMonthExpenseArrayObj =  filterByCurrentMonthandYear(expenseArray)
    const currentMonthExpenseArray = convertObjtoArr(currentMonthExpenseArrayObj)
    if(currentMonthExpenseArrayObj.length > 0){
        expenseList.innerHTML = '';
        !groupButton.classList.contains('active') ? (renderHistoryCard(currentMonthExpenseArrayObj, true), renderChart(currentMonthExpenseArray)) : groupItems(currentMonthExpenseArrayObj);
    }
    else{
        expenseList.innerHTML =  '';
        const noItems = document.createElement('p');
        noItems.innerHTML = 'No Expense/Income record for the current month';
        expenseList.appendChild(noItems)
    }
    // renderChart(currentMonthExpenseArray)
    renderCardAmounts(currentMonthExpenseArray)
}
function renderHistoryCard(currentMonthExpenseArrayObj, status){
    const elements = [];
    // FOLLOWING ARE DYNAMIC RENDERING LOGIC FOR THE DASHBOARD TXN HISTORY
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
        amount.classList.add( obj.type === 'Income' ? 'text-success' : 'text-danger', 'dashBoardAmount' ); // DYNAMIC FONT-COLOR BASED ON THE TYPE OF TRANSACTION MADE
        amount.textContent = `₹${obj.amount}`;
        amountContainer.appendChild(amount);
        amountContainer.classList.add('d-flex', 'flex-row', 'justify-content-center', 'align-items-center')
        const dotVertical = document.createElement('button')  // OPTIONS ICON ON EVERY ENTRY ON THE DASHBOARD ENTRIES TO EITHER EDIT AN ENTRY OR DELETE THEM ENTIRELY
        dotVertical.classList.add('border-0','bg-light-subtle','position-absolute', 'end-0');
        dotVertical.setAttribute('id', 'moreButton');
        dotVertical.setAttribute('data-bs-toggle', 'dropdown');
        dotVertical.setAttribute('data-bs-target', `#dashBoardDropdownmenu-${index}`)
        dotVertical.innerHTML = `<span class="material-symbols-outlined align-middle">more_vert</span>`;
        // EDIT/REMOVE LOGIC FOR INDIVIDUAL DASHBOARD ENTRIES
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
        elements.push(cardContainer)
    })
    return !status ? elements : null;
}

//LOGIC TO GROUP EXPENSE/INCOME AND THEREBY TO RENDER AN APPROPRIATE CHART
groupButton.addEventListener('click', ()=>{renderExpense(renderObject(expenseArrayHard))})
function groupItems(currentMonthExpenseArrayObj){
    const groupedArray = [];
    const commonElement = {};
    const uniqueArray = [];
    const nonUniqueArray = [];
    const dummyNonUniqueArray = [];
    currentMonthExpenseArrayObj.forEach(item=>{
        if(commonElement[item.reason]){
            commonElement[item.reason] += 1
        }
        else {
            commonElement[item.reason] = 1
        }
    })
    
    for(const reason in commonElement){
        if(+commonElement[reason] === +1){
            const unique = currentMonthExpenseArrayObj.filter((ele)=>{return reason === ele.reason})
            uniqueArray.push(...unique);
        }
        else{
            const dummyNonUniqueObj = {};
            const nonUnique = currentMonthExpenseArrayObj.filter((obj)=>{return reason === obj.reason})
            nonUniqueArray.push(...nonUnique);
            dummyNonUniqueObj['type'] = 'Expense';
            dummyNonUniqueObj['reason'] = reason;
            dummyNonUniqueObj['date'] = '01/01/01';
            const particularElement = currentMonthExpenseArrayObj.filter(ele=>{return reason === ele.reason})
            const totalAmountForParticularElement = particularElement.reduce((acc, value)=>{return acc+ +value.amount}, 0)
            dummyNonUniqueObj['amount'] = totalAmountForParticularElement;
            //grouped accordion
            const accordion = document.createElement('div');
            accordion.classList.add('accordion', 'mb-2', 'mx-sm-2');
            const accItem = document.createElement('div');
            accItem.classList.add('accordion-item', 'py-2');
            const accHead = document.createElement('div');
            accHead.classList.add('accordion-header');
            const accButton = document.createElement('button');
            accButton.classList.add('accordion-button', 'bg-white', 'border', 'border-0');
            accButton.setAttribute('id', 'dashBoardReason')
            accButton.setAttribute('data-bs-target', `#groupAccordion${reason}`);
            accButton.setAttribute('data-bs-toggle', 'collapse');
            accButton.innerHTML = reason;
            const priceSpan = document.createElement('span');
            priceSpan.classList.add(particularElement[0].type === 'Expense' ? 'text-danger' : 'text-success', 'ms-3', 'dashBoardGroupAmount');
            priceSpan.innerHTML = `₹${totalAmountForParticularElement}`;
            accButton.appendChild(priceSpan)
            accHead.appendChild(accButton);
            accItem.appendChild(accHead)
            const accColl = document.createElement('div');
            accColl.classList.add('accordion-collapse', 'collapse');
            accColl.setAttribute('id', `groupAccordion${reason}`);
            const accBody = document.createElement('div');
            accBody.classList.add('accordion-body');
            accBody.setAttribute('id', reason);
            accColl.appendChild(accBody);
            accItem.appendChild(accColl);
            accordion.appendChild(accItem);
            expenseList.appendChild(accordion);
            const cards = renderHistoryCard(particularElement, false);
            cards.forEach(item=>accBody.appendChild(item))
            dummyNonUniqueArray.push(dummyNonUniqueObj)
        }
    }
    groupedArray.push(...convertObjtoArr(dummyNonUniqueArray))
    groupedArray.push(...convertObjtoArr(uniqueArray))
    renderChart(groupedArray);
    uniqueArray.length > 0 ? renderHistoryCard(uniqueArray, false) : null;
}
// SELECTS EVERY INDIVIDUAL ENTRY FROM THE OVERALL EXPENSE/INCOME ENTRY DISPLAYED ON DASHBOARD
cardbody.forEach((item)=>{
    // ADDING A CLICK EVENT TO EVERY ENTRY, SO AS TO IDENTIFY WHICH OPTION IN THE OPTIONS(EDIT OR DELETE) IS BEING SELECTED
    item.addEventListener('click', (e)=>{
        // IF THE SELECTED OPTION IS KNOWN TO BE 'EDIT', THEN THE CONTENT WILL BE SET TO EDITABLE AND HENCE THE USER CAN EDIT THE SAME
        if(e.target.textContent === 'Edit amount'){
            const ul = e.target.parentElement;
            const targetId = +(ul.id.split('-')[1]);
            const amountField = (ul.parentElement).firstChild;
            amountField.setAttribute('contenteditable', 'true');
            amountField.classList.add('bg-info-subtle')
            const currentExpenseArray = convertObjtoArr(filterByCurrentMonthandYear(renderObject(expenseArrayHard)))
            const currentMonthIndex = expenseArrayHard.length - currentExpenseArray.length
            const targetIndex = currentMonthIndex + targetId
            amountField.addEventListener('keypress', (e)=>{
                // ONCE THE CONTENT IS EDITED, IT IS THEN WAITS FOR A 'ENTER' KEY EVENT. IF THAT HAPPENS, THE INDIVIDUAL ENTRY GETS REPLACED BY THE NEW ENTRY AND SO THE EXPENSE ARRAY GETS UPDATED.
                if(e.key === 'Enter'){
                    e.preventDefault();
                    const changedValue = e.target.textContent[0] === '₹' ? ((e.target.textContent).split('₹'))[1] : e.target.textContent;
                    amountField.removeAttribute('contenteditable');
                    amountField.classList.remove('bg-info-subtle')
                    const existingValue = expenseArrayHard[targetIndex];
                    existingValue.splice(3,1, changedValue);
                    expenseArrayHard.splice(targetIndex, 1, existingValue);
                    updateLocalstorage(expenseArrayHard, 'expense')
                    // renderExpense(expenseArrayHard)
                }
            })
    }
        else if(e.target.textContent === 'Edit description'){
            const ul = e.target.parentElement;
            const targetId = +(ul.id.split('-')[1]);
            const descriptionField = (ul.parentElement).previousSibling.firstChild;
            descriptionField.setAttribute('contenteditable', 'true');
            descriptionField.classList.add('bg-info-subtle')
            const currentExpenseArray = convertObjtoArr(filterByCurrentMonthandYear(renderObject(expenseArrayHard)))
            const currentMonthIndex = expenseArrayHard.length - currentExpenseArray.length
            const targetIndex = currentMonthIndex + targetId
            descriptionField.addEventListener('keypress', (e)=>{
                if(e.key==='Enter'){
                    e.preventDefault();
                    const changedDesc = e.target.textContent;
                    descriptionField.removeAttribute('contenteditable');
                    descriptionField.classList.add('bg-info-subtle')
                    const existingDesc = expenseArrayHard[targetIndex];
                    existingDesc.splice(1,1,changedDesc);
                    expenseArrayHard.splice(targetIndex, 1, existingDesc)
                    updateLocalstorage(expenseArrayHard, 'expense')
                }
            })
        }
        // LOGIC FOR THE DELETION OF AN INDIVIDUAL ENTRY
        else if(e.target.textContent === 'Delete'){
            const ul = e.target.parentElement;
            const targetId = +(ul.id.split('-')[1]); // DELETION ACHEIVED THROUGH ARRAY SPLICING. I DIDN'T COME UP WITH ANY OTHER BETTER APPROACHES TO BE HONEST.
            const currentExpenseArray = convertObjtoArr(filterByCurrentMonthandYear(renderObject(expenseArrayHard)))
            const currentMonthIndex = expenseArrayHard.length - currentExpenseArray.length
            const targetIndex = currentMonthIndex + targetId;
            expenseArrayHard.splice(targetIndex, 1)
            updateLocalstorage(expenseArrayHard, 'expense')
        }
})
})

// UPDATING THE 'BALANCE CARD', 'EXPENSE CARD' AND THE 'INCOME CARD' ON THE DASHBOARD BASED ON THE VALUES FROM THE SAVED ENTRIES
function renderCardAmounts(currentMonthExpenseArray){
        let totalAmount = 0;
        let totalExpense = 0;
        let totalIncome = 0;
        let totalExpensePercentage = 0;
    if(currentMonthExpenseArray.length > 0){ 
        currentMonthExpenseArray.forEach(item=>{
            totalIncome += item[0]==='Income' ? Number(item[3]) : 0;
            totalExpense += item[0] === 'Expense' ? Number(item[3]) : 0;
        })
    } 
    totalAmount = totalIncome - totalExpense;
    totalExpensePercentage = (100-(((totalAmount) / (totalIncome))*100)).toFixed(2)
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
    cardExpense.innerHTML =  `₹${totalExpense.toLocaleString('en-IN')} <span class='text-muted percentage'>(${totalExpensePercentage}% of total)</span>`
}

const legendToggleSwitch = document.getElementById('legendToggle');
let legendtoggleStatus = false;
legendToggleSwitch.addEventListener('click', ()=>{legendtoggleStatus=!legendtoggleStatus;console.log(legendtoggleStatus);updateChart()})
function updateChart(){
    if(myPieChart){
        myPieChart.options.plugins.legend.display = legendtoggleStatus;
        myPieChart.update();
    }
}
// PIE CHART SECTION
var myPieChart;
function renderChart(chartArr) {
    
    if (myPieChart) {
        myPieChart.destroy(); // CLEAR ANY PREVIOUS INSTANCES OF PIECHARTS ON THE CANVAS TO AVOID OVERALAPPING
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
            hoverOffset: 5
        }]
    };
    var config = {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                    display:false,
                    labels: {
                        color: 'rgb(0, 0, 0)'
                    }, 
                    position: 'right'
                }
            }  
        }    
    };
    myPieChart = new Chart(ctx, config); // CREATING NEW CHART INSTANCE BASED ON THE PREVIOUS VALUES AND CONFIGS
}

// FORM TO LET USER ADD ANY EXPENSE/INCOME AND LETS HIM/HER TO STORE THE VALUES PERMANANTLY OVER THE LOCALSTORAGE.
formModal.addEventListener('submit',(e)=>{ 
    // FORM VALIDATION
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
        // ONCE THE FORM DATA HAS BEEN COLLECTED, THE DATA IS THEN USED TO UPDATE THE LOCALSTORAGE AND THEN IS USED TO RE-RENDER CONTENTS ON THE DASHBOARD
        renderExpense(renderObject(expenseArrayHard))  
        updateLocalstorage(expenseArrayHard, 'expense')
    } 
})

// SIMILAR TO A FORM, BUT COLLECTS EXPENSE/INCOME DATA THROUGH THE IMAGES UPLOADED BY THE USER. IMAGES MAY BE BILLS OF VARIOUS KINDS. THIS IS AN EXPERIMENTAL FEATURE AND WON'T WORK PROPERLY AND IS HIGHLY DEPENDANT ON THE TESSERACTjS LIBRARY.
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
        // TEXT RECOGNITION PHASE
        Tesseract.recognize(
            indFile,
            'eng',
            { logger: m => { // LOGGER INCLUES DATA RELATED TO THE LOADING PHASE
                progressBar.style.width = `${(m.progress) * 100}%`;
                progressBarStatus.innerHTML = m.status.charAt(0).toUpperCase() + m.status.slice(1)
                progressBarStatus.innerHTML === 'Recognizing text' && progressBar.style.width === '100%' ?
                (scannerCol.removeChild(progressBarContainer),scannerCol.removeChild(progressBarStatus), scannerButton.classList.add('visually-hidden'),scannerCol.innerHTML = '<a type="button" class="btn btn-success" id="revealButton" href="#scannedContentContainer">Reveal scanned content</a>') : null;
                document.getElementById('revealButton')? document.getElementById('revealButton').addEventListener('click',()=>{
                    scannedContent.classList.remove('visually-hidden')
                }):null;
            } }// ACTUAL DATA IS OBTAINED AS A PROMISE WHICH IS THEN PARSED USING THENABLES
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
            inpArray.forEach((item,idx)=>{
                const inpGrp = document.createElement('div')
                inpGrp.classList.add('input-group','my-2');
                const inpGrpButton = document.createElement('button')
                inpGrpButton.classList.add('btn','btn-outline-success','inpGrpButton')
                inpGrpButton.setAttribute('data-bs-toggle','button')
                inpGrpButton.innerHTML = 'OK'
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
                    count === 3? (upd = e.target.innerHTML.split('-'), updated = `${upd[2]}-${upd[1]}-${upd[0]}`, inpArray[2].value = updated) : inpArray[count-1].value = e.target.innerHTML
                    badgeDiv.removeChild(e.target)
                })
            })
            
          })
      })
    }
})

// FOLLOWING ARE CODE FOR DUES SECTION
dueDropdown.addEventListener('click', (e)=>{
    if(e.target.id === 'everyMonth'){
        dueDropdown.classList.add('selected');
    }
})

const dueObjArr = JSON.parse(localStorage.getItem('dueArray')) || []; // LOCALSTORAGE TAKES CARE OF DUESarray IN ADDITION TO THE OVERALL EXPENSE/ INCOME ARRAY
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
})

// FROM THE DUESARRAY, CARDS ARE BEING RENDERED
function renderDueCards(dueObjArr){
    dueCardContainer.innerHTML = '';
    dueObjArr.forEach((obj, index)=>{
        const dueCard = document.createElement('div');
        dueCard.classList.add('col','col-10','col-md-5','col-lg-5','v-stack','rounded-2','border','p-2','m-2');
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
                // LOGIC TO DYNAMICALLY CHANGE THE BG-COLOR OF THE CARD BASED ON THE NUMBER OF DAYS LEFT FOR THE DUE DATE
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
                        }
                        else removeCard(e) 
                    }
                }
                dueDeleteButton.onclick = (e)=>{removeCard(e)}
                function removeCard(e){
                    const parent = e.target.parentElement;
                    const cardElement = parent.parentElement;
                    dueObjArr.splice(cardElement.id, 1);
                    updateLocalstorage(dueObjArr, 'due')
                }
                dueCard.appendChild(dueDoneButton)
                dueCard.appendChild(dueDeleteButton)
            }
        }
        dueCardContainer.appendChild(dueCard)
    }) 
}
renderDueCards(dueObjArr) // CALLING THE FUNCTION IN THE GLOBAL SCOPE, SO THAT THE CARDS ARE RENDERED AS SOON AS THE APPLICATION LOADS FOR THE FIRST TIME

// FUNCTION TO CALCULTE DIFFERENCE IN NUMBER OF DAYS (TARGET DATE - CURRENT DATE)
function findDaysDifference(targetDate){
    const today = new Date()
    const target = new Date(targetDate)
    const difference = (target-today) / ( 1000 * 60 * 60 * 24 )
    return difference;
}

// GENERAL FUNCTION TO BE CALLED AT VARIOUS PLACES IN THE APPLICATION TO UPDATE/ SET APPROPRIATE VALUES IN THE LOCALSTORAGE
function updateLocalstorage(array, type){
    switch(type){
        case 'expense':
            localStorage.setItem('expenseArray',JSON.stringify(sortedExpenseArray(array)))
            renderExpense(renderObject(array))
            break;
        case 'due': 
            localStorage.setItem('dueArray', JSON.stringify(sortedExpenseArray(array)));
            renderDueCards(array);
            break;
    }
      
}   

// RESET BUTTON RESETS THE DASHBOARD AND WIPES OUT EVERY DATE FROM THE LOCALSTORAGE
resetButtons.forEach(item=>{
    item.addEventListener('click',(e)=>{
        e.target.innerHTML === 'Yes' ? (localStorage.removeItem('expenseArray'),renderExpense(expenseArrayHard),location.reload()) : null
    })
})
