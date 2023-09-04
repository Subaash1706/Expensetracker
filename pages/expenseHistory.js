import { expenseArrayHard } from "../main.js";
console.log('from expenseHistory.js', expenseArrayHard)
const months = ["January", "February", "March", "April","May", "June", "July", "August","September", "October", "November", "December"];
const monthAccordion = document.getElementById('monthAccordion');



function renderAccordion(){
    const accCont = document.createElement('div')
    accCont.classList.add('accordion','mt-3')
    accCont.id = `accCont`
    // const accCont = document.querySelector('.accordion')
    months.forEach(month=>{
        const accItem = document.createElement('div')
        accItem.classList.add('accordion-item')
        accCont.appendChild(accItem)
        const accHeader = document.createElement('div')
        accHeader.classList.add('accordion-header')
        accItem.appendChild(accHeader)
        const accBtn = document.createElement('div')
        accBtn.classList.add('accordion-button','display-5','bg-white')
        accBtn.setAttribute('data-bs-target',`#accordionCollapse${month}`)
        accBtn.setAttribute('data-bs-toggle','collapse')
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
        accBody.classList.add('accordion-body')
        accBody.innerHTML = month;
        accCollapse.appendChild(accBody)
        accItem.appendChild(accCollapse)
        monthAccordion.appendChild(accCont)
    })
}
renderAccordion()


