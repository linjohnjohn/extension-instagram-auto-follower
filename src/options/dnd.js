function handleDragStart() {
    this.dispatchEvent(new Event('dnddragstart', { bubbles: true }));
    this.style.transform = 'rotate(5deg)'
    this.style.zIndex='1000'
}

function handleDragOver (e) {
    e.preventDefault();
    this.dispatchEvent(new Event('dnddragover', { bubbles: true }));
}

function handleDragEnd(e) {
    e.preventDefault();
    this.dispatchEvent(new Event('dnddragend', { bubbles: true }));
    this.style.transform = 'rotate(0deg)'
    this.style.zIndex='0'
}

export default class Dnd {
    constructor(parentElement, onNewDisplayOrder, onSaveNewOrder) {
        this.parentElement = parentElement;
        this.childrenElements = [];
        this.dataArray = [];
        this.draggingId = null;
        this.draggedOverId = null;
        this.onNewDisplayOrder = onNewDisplayOrder;
        this.onSaveNewOrder = onSaveNewOrder;

        this.parentElement.addEventListener('dnddragstart', (e) => {
            this.draggingId = e.target.dataset.dndId;
        });

        this.parentElement.addEventListener('dnddragover', (e) => {
            this.draggedOverId = e.target.dataset.dndId;
            const newArray = calculateChange(this.dataArray, this.draggingId, this.draggedOverId);
            this.dataArray = newArray;
            this.onNewDisplayOrder(newArray);
        });

        this.parentElement.addEventListener('dnddragend', (e) => {
            this.onSaveNewOrder(this.dataArray)
        });
    }

    reinitializeChildren(newChildren, dataArray) {
        this.childrenElements.forEach(element => {
            element.removeEventListener('dragstart', handleDragStart);
            element.removeEventListener('dragover', handleDragOver);
            element.removeEventListener('dragend', handleDragEnd);
        });

        this.childrenElements = newChildren;
        this.dataArray = dataArray;

        this.childrenElements.forEach(element => {
            element.setAttribute('draggable', true);
            element.addEventListener('dragstart', handleDragStart);
            element.addEventListener('dragover', handleDragOver);
            element.addEventListener('dragend', handleDragEnd)
        });
    }
}

const calculateChange = (dataArray, draggingId, draggedOverId) => {
    const originIndex =  dataArray.findIndex(id => id === draggingId);
    const destIndex = dataArray.findIndex(id => id === draggedOverId);
    let newArray = [ ...dataArray ];
    newArray.splice(originIndex, 1);
    newArray.splice(destIndex, 0, draggingId);

    return newArray;
}