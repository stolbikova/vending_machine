/*Init data*/
let amount = {
    '1P': 10,
    '2P': 30,
    '5P': 20,
    '10P': 15
}

let vmState = {
    'tea': 10,
    'coffee': 20,
    'coffee with milk': 20,
    'juice': 15
}

let prices = {
    'tea': 13,
    'coffee': 18,
    'coffee with milk': 20,
    'juice': 15
}

let vmchange = {
    '1P': 100,
    '2P': 100,
    '5P': 100,
    '10P': 100
}

let clientChange = {
    '1P': 0,
    '2P': 0,
    '5P': 0,
    '10P': 0
}
/**/

function getTotal(amount) {
    return 1 * amount['1P'] + 2 * amount['2P'] + 5 * amount['5P'] + 10 * amount['10P']
}

let fillList = (listId, obj) => {
    let ulList = document.getElementById(listId);

    for (prop in obj) {

        var li = document.createElement("LI");
        var t = document.createTextNode(`${prop}  :  ${obj[prop]} pieces`);
        li.appendChild(t);
        li.id = prop;
        //set style to li element
        li.style.width = '50%';
        li.style.margin = '5px 5px 5 px 5px';
        li.style.float = 'left';

        ulList.appendChild(li);
    }

    ulList.style.listStyleType = 'none';
}

function showAmount(perseamount) {
    fillList('perse-list', perseamount);
}

function showVMState(vmState) {
    fillList('vm-list', vmState);
}

function showTotal(amount) {
    document.getElementById('total').innerHTML = `Total: ${getTotal(amount)}`;
}

function createBtnsForList(listId) {
    let ulList = document.getElementById(listId);
    let items = ulList.getElementsByTagName("li");

    for (let i = 0; i < items.length; ++i) {
        let button = document.createElement("button");
        button.id = 'btn' + items[i].id;

        //style buttons
        button.style.margin = '5px 5px 5px 5px';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#9fb3fc';

        //create br element
        let br = document.createElement("br");

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        insertAfter(button, items[i]);
        insertAfter(br, button);

        let t = '';
        const id = items[i].id;

        if (id == 'tea' || id == 'coffee' || id == 'coffee with milk' || id == 'juice')
            t = `Buy for ${prices[id]}P`;
        else if (id == '1P' || id == '2P' || id == '5P' || id == '10P')
            t = `Enter ${id}`;

        button.innerHTML = t;
        button.style.marginLeft = '10px';
    }
}

function showChange(change) {
    fillList('vmchange-list', change);
}

function changeAmount(value, isInc) {

    let dec = 0;
    let inc = 0;

    if (isInc) {

        if (typeof (value) != 'object')
            throw new Error("Data isn't correct!");

        for (key in amount) {
            amount[key] += parseInt(value[key]);

            //show amount
            if (value[key]) {
                let li = document.getElementById(key);
                li.textContent = `${key} : ${amount[key]} peaces`;
            }
        }

    } else {
        dec = value;
    }

    if (amount[value + 'P'] >= dec) {
        amount[value + 'P'] -= dec;
    }

    showTotal(amount);
}

function changeAmountDeposited(value, isInc) {
    let inc = 0;
    let dec = 0;

    if (isInc) {
        inc = value;
    } else {
        dec = value;
    }

    let vmamount = document.getElementById('amount-deposited');

    if (vmamount.value < dec) {
        alert("You deposited not enought money!");
        dec = 0;
        return false;
    }

    vmamount.value = inc + parseInt(vmamount.value) - dec;
    return true;
}

function returnChange() {

    let r = document.getElementById('amount-deposited').value;

    console.log(r);

    function rec(r, dividerId) {
        dividers = [10, 5, 2, 1];
        const i = dividers[dividerId];
        const id = `${i}P`;
        
        let rem = 0;
        if (r / i >= 1) {
            clientChange[id] = parseInt((r / i).toFixed(1));
            vmchange[id] -= clientChange[id];
            rem = r % i;
            //console.log("i:", i, "id:", id, 'clientChange[id]', clientChange[id], 'rem', rem);
        }
        else if (i != (dividers.length - 1)) {
            rec(r, dividerId + 1);
        }

        if ((rem != 0) && (i != (dividers.length - 1))) {
            rec(rem, dividerId + 1);
        }

        if(rem == 0) return 0;
    }

    rec(r, 0);

    //change amount deposited to 0
    document.getElementById('amount-deposited').value = 0;

    //change vm change list
    let chList = document.getElementById('vmchange-list');
    let items = chList.getElementsByTagName("li");
    for (let i = 0; i < items.length; i++) {
        items[i].textContent = `${items[i].id} : ${vmchange[items[i].id]} pieces`
    }
}

function setHandlers() {
    let pepseList = document.getElementById('perse-list');
    let items = pepseList.getElementsByTagName("li");

    for (let i = 0; i < items.length; ++i) {

        let button = document.getElementById("btn" + items[i].id);
        button.onclick = function () {
            let id = items[i].id;

            //get only numbers
            let myRe = new RegExp("[0-9]+");
            let arr = myRe.exec(id);

            //change 
            changeAmount(parseInt(arr[0]), false);
            changeAmountDeposited(parseInt(arr[0]), true);
        };
    }

    vmList = document.getElementById('vm-list');
    vmitems = vmList.getElementsByTagName("li");

    for (let i = 0; i < vmitems.length; ++i) {

        let button = document.getElementById("btn" + vmitems[i].id);
        button.onclick = function () {
            let id = vmitems[i].id;

            if (changeAmountDeposited(prices[id], false)) {

                //change vm list
                let li = document.getElementById(id);
                vmState[id]--;
                li.textContent = `${id} : ${vmState[id]} pieces`;

                returnChange();

                //show received money in purse
                changeAmount(clientChange, true);
            }
        };
    }
}

/*Initialization*/
showAmount(amount);
showVMState(vmState);
showChange(vmchange);
createBtnsForList('vm-list');
createBtnsForList('perse-list');
setHandlers();
showTotal(amount);