$(document).ready(function(){ 

    var grid = document.getElementById('data_table');
    grid.onclick = function(e) {
        if (e.target.tagName != 'TH') return;
        sortGrid(e.target.cellIndex);
    };
        
    function sortGrid(colNum) {
        var tbody = grid.getElementsByTagName('tbody')[0];
        var rowsArray = [].slice.call(tbody.rows);
        var compare = function(rowA, rowB) {
            return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML;
        };

        rowsArray.sort(compare);
        grid.removeChild(tbody);
        for (var i = 0; i < rowsArray.length; i++) {
            tbody.appendChild(rowsArray[i]);
        }
        grid.appendChild(tbody);
    };
    
    $('th:first-child').click(function(){
        $('#first_span').css('display', 'inline');
        $('#second_span').css('display', 'none');
    });
    
    $('th:nth-child(2)').click(function(){
        $('#second_span').css('display', 'inline');
        $('#first_span').css('display', 'none');
    });
    
})