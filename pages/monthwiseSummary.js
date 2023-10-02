const months = ["January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December"];
const monthContainer = document.getElementById('monthAccordion');

// FUNCTION TO GET THE CARD DETAILS PASSED AS A PARAM FROM ANOTHER PAGE
function getUrlParams(searchFor){
    const param = new URLSearchParams(window.location.search)
    return param.get(searchFor);
}
const cardChosen = getUrlParams('card');
document.getElementById('navbarText').textContent = `Monthwise summary - ${cardChosen}`;

// FUNCTION THAT RETURNS YEAR AND MONTH INFO OF THE ARGUMENT
function getDateData(date, searchFor){
    if(searchFor === 'year') return new Date(date).getFullYear()
    else if(searchFor === 'month') return new Date(date).getMonth();
}

// FUNCTION TO ACCESS THE LOCALSTORAGE
const lsObjArray = [];
function fetchLocalStorageData(){
    try{
        const lsArray = localStorage.getItem('expenseArray')
        if(!lsArray.length > 0){
            throw new Error('Add expense/income data to look at the history')
        }
        else{
            const keys = ['type', 'reason', 'date', 'amount'];
            JSON.parse(lsArray).forEach((arrayItem) => {
                const lsObj = {};
                keys.forEach((key, index) => {
                    lsObj[key] = arrayItem[index];
                    })
                lsObjArray.push(lsObj);   
            });
            
        }
    }
    catch(err){
        const errMsg = err
        console.log(errMsg)
    }
}
fetchLocalStorageData();

// FILTERING CURRENT MONTH'S DATA FROM THE OVERALL RECORD
const yearSpecificArray = lsObjArray.filter((obj)=>{return +getDateData(obj.date, 'year') === +cardChosen})

// RENDERING INDIVIDUAL ACCORDION FOR EVERY MONTH OF THE YEAR AND PROVIDING APPROPRATE DATA INTO THE ACCORDION BODY
function renderAccordion(){
    const accCont = document.createElement('div')
    accCont.classList.add('accordion','mt-3','w-75')
    accCont.id = `accCont`
    months.forEach(month=>{
        const accItem = document.createElement('div')
        accItem.classList.add('accordion-item','m-4','border')
        accCont.appendChild(accItem)
        const accHeader = document.createElement('div')
        accHeader.classList.add('accordion-header')
        accItem.appendChild(accHeader)
        const accBtn = document.createElement('div')
        accBtn.classList.add('accordion-button','display-5','bg-white')
        accBtn.setAttribute('data-bs-target',`#accordionCollapse${month}`)
        accBtn.setAttribute('data-bs-toggle','collapse')
        accBtn.setAttribute('id', month)
        const btnFont = document.createElement('h6')
        btnFont.classList.add('display-6')
        btnFont.style = 'font-size: 25px'
        btnFont.innerHTML = month
        accBtn.appendChild(btnFont)
        accHeader.appendChild(accBtn)
        const accCollapse = document.createElement('div')
        accCollapse.classList.add('accordion-collapse','collapse')
        accCollapse.id = `accordionCollapse${month}`
        accCollapse.setAttribute('data-bs-parent',`#accCont`)
        const accBody = document.createElement('div')
        accBody.classList.add('accordion-body','d-flex','justify-content-start','align-items-center','flex-column','container')
        accBody.innerHTML = month;
        accCollapse.appendChild(accBody)
        accItem.appendChild(accCollapse)
        monthAccordion.appendChild(accCont)
    })
}
renderAccordion()
const accordionBody = document.querySelectorAll('.accordion-body');
const accordionButton = document.querySelectorAll('.accordion-button')
accordionButton.forEach((button, accordionIndex)=>{
    button.addEventListener('click', (e)=>{
        const monthSpecificData = yearSpecificArray.filter((obj)=> +getDateData(obj.date, 'month') === +(accordionIndex))
        if(!monthSpecificData.length > 0){
            accordionBody[accordionIndex].textContent = 'No data found for the selected month'
        }
        else{
            if(e.target.classList.contains('collapsed')){
                accordionBody[accordionIndex].innerHTML = '';
            }
            else{
                accordionBody[accordionIndex].innerHTML = '';
                const renderedCards = renderCards(monthSpecificData);
                accordionBody[accordionIndex].appendChild(renderedCards);
            }
            
        }
        
    })
})

// DATA TO BE DISPLAYED IN FORM OF CARDS INSIDE THE ACCORDION BODY
function renderCards(currentMonthExpenseArray){
    const cardMainContainer = document.createElement('div')
    cardMainContainer.classList.add('row','w-100')
    currentMonthExpenseArray.forEach((item) => {
            const cardContainer = document.createElement('div')
            cardContainer.classList.add('card','rounded','m-2','mx-auto');
            cardContainer.classList.add( item.type === 'Income' ? 'bg-success-subtle': 'bg-danger-subtle' )
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body','d-flex','justify-content-between','align-items-center','col', 'col-11','w-100','flex-column','flex-md-row');
        for(const key in item){
            const cardContent = document.createElement('div')
            cardContent.classList.add('text-center','p-2','p-md-0','cardContent')
            if(key === 'amount'){
                cardContent.textContent =`₹${(item[key]).toLocaleString('en-IN')}`
            }
            else{
                cardContent.textContent = item[key];
            }
            cardBody.appendChild(cardContent);
        }
        cardContainer.appendChild(cardBody);
        cardMainContainer.appendChild(cardContainer);
    });
    return cardMainContainer
}