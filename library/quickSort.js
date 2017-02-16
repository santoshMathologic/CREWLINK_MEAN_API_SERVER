/**
 * This From is a Quick sort algorithm
 * @Author : Santosh
 * 4-Aug-2016
 */
function quickSort(items, left, right ,property,isDesc) {

    var index;

    if (items.length > 1) {

        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? items.length - 1 : right;

        index = partition(items, left, right ,property,isDesc);

        if (left < index - 1) {
        	quickSort(items, left, index - 1,property,isDesc);
        }

        if (index < right) {
        	quickSort(items, index, right ,property,isDesc);
        }

    }

    return items;
}

function partition(items, left, right ,property,isDesc) {
	var temp;
    var pivot   = items[Math.floor((right + left) / 2)],
        i       = left,
        j       = right;


    while (i <= j) {
    	temp = items[i]; 
        while ((isDesc)?parseFloat(temp[property]) > parseFloat(pivot[property]) : parseFloat(temp[property]) < parseFloat(pivot[property])) {
            i++;
            temp = items[i]; 
        }
        temp = items[j]; 
        while ((isDesc)?parseFloat(temp[property]) < parseFloat(pivot[property]) : parseFloat(temp[property]) > parseFloat(pivot[property])) {
            j--;
            temp = items[j]; 
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function swap(items, firstIndex, secondIndex){
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}