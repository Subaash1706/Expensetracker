const monthContainer = document.getElementById('monthAccordion');
const body = document.querySelector('body');

const lsObjArray = [];
const recordYears = new Set();
const paraTag = document.createElement('div');
paraTag.innerHTML = 'Add some data to view yearwise Expense/Income history'
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
            lsObjArray.forEach((obj)=>{
                recordYears.add(
                    (new Date(obj.date)).getFullYear()
                )
            })
            const recordYearsArray = [...recordYears];
            const sortedRecordYearsArray = recordYearsArray.sort((a,b)=>a-b)
            renderYearCards(sortedRecordYearsArray)
        }
    }
    catch(err){
        const errMsg = err;
        body.appendChild(paraTag)
        console.log(errMsg)
    }
}
fetchLocalStorageData()
function getYearData(date){
    return new Date(date).getFullYear()
}
function renderYearCards(recordYearsArray){
    const sortedLsObjArray = lsObjArray.sort((item, item2)=>getYearData(item.date)-getYearData(item2.date))
    const backData = backdropData(sortedLsObjArray)
    recordYearsArray.forEach((record, index)=>{
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card','m-2','col','col-11', 'col-md-6','col-lg-3','z-0','yearCard');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body','lead');
        cardBody.setAttribute('id',record)
        cardBody.textContent = record;
        const cardBackDrop = document.createElement('div');
        cardBackDrop.classList.add('cardBackdrop');
        if(backData[index].Year === record){
            const data =  document.createElement('div')
            const incomeData = document.createElement('p');
            incomeData.innerHTML =   `Income: <span class='text-success lead'>₹${(backdropData(lsObjArray)[index].Income).toLocaleString('en-IN')}</span>`
            const expenseData = document.createElement('p');
            expenseData.innerHTML =  `Expense: <span class='text-danger lead'>₹${(backdropData(lsObjArray)[index].Expense).toLocaleString('en-IN')}</span>`
            data.appendChild(incomeData)
            data.appendChild(expenseData)
            cardBackDrop.appendChild(data)
        }
        cardBody.appendChild(cardBackDrop)
        cardContainer.appendChild(cardBody)
        monthContainer.appendChild(cardContainer);
        cardContainer.style.backgroundImage = `url(../images/vectors/bg-${Math.floor(Math.random() * 6)}.jpg)`
    })
}
const yearCard = document.querySelectorAll('.yearCard');
yearCard.forEach((card)=>{
    card.addEventListener('click',(e)=>{
        console.log(e.target)
        window.location.href = `./monthwiseSummary.html?card=${e.target.id}`
    })
})
const arrRecordYears = [...recordYears]
function backdropData(lsObjArray){
    return lsObjArray.reduce((accResult, obj)=>{
        const year = new Date(obj.date).getFullYear();
        const type = obj.type === 'Income' ? 'Income' : 'Expense';
        const yearData = accResult.find(item=>item.Year === year)
        if(!yearData){
            accResult.push({
                Year: year,
                Income: 0,
                Expense: 0
            })
        }
        const updatedYearData = accResult.find(item=>item.Year===year)
        updatedYearData[type] += +obj.amount
        return accResult
    },[])
}   

function renderMonths(monthsArray){
    monthsArray.forEach((month)=>{
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('card', 'col', 'col-3', 'm-2');
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header','lead');
        cardHeader.textContent = month;
        cardContainer.appendChild(cardHeader);
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardHeader.appendChild(cardBody);
        monthContainer.appendChild(cardContainer);
    })
}
// renderMonths(months)
