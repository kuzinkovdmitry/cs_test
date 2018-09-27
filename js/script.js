$(document).ready(function(){
    
    var url = "/json/data.json";
    var temp_of_tr = "<tr>" + "<td class='info'>" + "</td>" + "<td class='info'>" + "</td>" + "<td class='del'>"  + "<img class='edit_data' src='img/edit.png' title='Edit' alt='Edit'>" + "<img class='save_data' src='img/save.png' title='Save' alt='Save'>" + "<img class='delete_data' src='img/delete.png' title='Delete' alt='Delete'>" + "</td>" + "</tr>";
    var table = $('#data_table');
    var arr_data = [];
    var item = {};
    var one_row;
    var elem_row_info;
    var row_id;
    var button_clicked = false;
    
    getDataFromJSON();
    
    $('#add_data').click(addNewData);
    
    $('#add_json_data').click(addJSONData);
    
    $('#back_to_json').click(tableToJSON);
    
    $('#add_csv').click(addCSVData);
    
    $('#get_csv').click(getCSV);
        
    function getDataFromJSON(){
        $.getJSON(url, function(result){
            arr_data = result;
            arr_data.forEach(function(item, i){
                var tbody = $('tbody');
                render_row(item, tbody);
            });
        });
    };
    
    function addNewData(){
        var new_album = {
            id: arr_data[arr_data.length - 1].id + 1,
            name: $("#text_name").val(),
            value: $("#text_value").val()
        };
        if(new_album.name == '' || new_album.value == ''){
            alert("Fill in all the fields!")
        }
        else{
            arr_data.push(new_album);        
            render_row(new_album, table);
            $("#text_name").val('');
            $("#text_value").val('');
        }
    }
    
    function render_row(item, tbody){
        var template = $(temp_of_tr);
        template.attr('data-id', item.id);
        template.find('td:first-child').html(item.name);
        template.find('td:nth-child(2)').html(item.value);
        template.appendTo(tbody);
        template.find(".delete_data").on("click", delete_row);
        template.find(".edit_data").on("click", edit_row);
        template.find(".save_data").on("click", save_row);
    };
    
    function delete_row(){
        getRowById(this);
        arr_data.splice($.inArray(one_row, arr_data), 1);
        $('#data_table').find('tr[data-id=' + row_id + ']').remove();
    }
    
    function edit_row(){
        getRowById(this);
        elem_row_info = $('#data_table').find('tr[data-id=' + row_id + ']');
        elem_row_info.find('td:first-child').html("<input type='text' value='" + one_row.name + "'>");
        elem_row_info.find('td:nth-child(2)').html("<input type='text' value='" + one_row.value + "'>");
        elem_row_info.find('.edit_data').css('display', 'none');
        elem_row_info.find('.save_data').css('display', 'inline-block');
    }
    
    function getRowById(element){
        row_id = $(element).parents('tr').attr('data-id');
        one_row = arr_data.find(arr_data => arr_data.id == row_id);
    }
    
    function save_row(){
        var save_name = elem_row_info.find('td:first-child').find('input').val();
        var save_value = elem_row_info.find('td:nth-child(2)').find('input').val();
        if(save_name == '' || save_value == ''){
            alert("Fill in all the fields!")
        }
        else{
            one_row.name = save_name;
            one_row.value = save_value;
            elem_row_info.find('td:first-child').html(one_row.name);
            elem_row_info.find('td:nth-child(2)').html(one_row.value);
            elem_row_info.find('.edit_data').css('display', 'inline-block');
            elem_row_info.find('.save_data').css('display', 'none');  
        }  
    }
    
    function addJSONData(){
        if (button_clicked == true){
            arr_data = [];
            $('tbody').empty();
            button_clicked = false;
        };
        if (button_clicked == false){
            var json_value_of_area = $('#json_area').val();
            if(json_value_of_area == ''){
                alert("Fill in the field!")
            }
            else{
                try{
                    var parsed_json = JSON.parse(json_value_of_area);
                    var arr_of_area = parsed_json;
                    for(var i = 0; i < arr_of_area.length; i++){
                        
                        for(var k = 0; k < arr_data.length; k++){
                            if(arr_of_area[i].id == arr_data[k].id){
                                arr_of_area[i].id = arr_data[arr_data.length - 1].id + 1;
                            }
                        }
                        
                        arr_data.push(arr_of_area[i]);
                        for(var j = 0; j < arr_data.length; j++){
                            if(!arr_data[j].id){
                                arr_data[j].id = arr_data[arr_data.length - 2].id + 1;
                            };

                        }
                        
                        render_row(arr_of_area[i], table)

                    }
                    $('#json_area').val('');
                }
                catch(err){
                    alert('Invalid input format!')
                }
            } 
        }
        
    }
    
    function tableToJSON(){
        button_clicked = true;
        var to_json = JSON.stringify(arr_data);
        $('#json_area').val(to_json);
    }
    
    function addCSVData(){
        d3.text('/csv/data.csv', function(data){
            var parsedCSV = d3.csv.parseRows(data);
            for(var i = 1; i < parsedCSV.length; i++){
                var csv_one_obj = {
                        id: '',
                        name: '',
                        value: ''
                };
                var csv_one_arr = parsedCSV[i].join().split(';');
                for(var j = 0; j < csv_one_arr.length; j++){
                    csv_one_obj.id = Number(csv_one_arr[0]);
                    csv_one_obj.name = csv_one_arr[1];
                    csv_one_obj.value = csv_one_arr[2];
                }
                for(var k = 0; k < arr_data.length; k++){        
                    if(csv_one_obj.id == arr_data[k].id){
                        csv_one_obj.id = arr_data[arr_data.length - 1].id + 1;
                    }
                }
                arr_data.push(csv_one_obj);
                render_row(csv_one_obj, table);
            }
        })
    }
    
    function getCSV(){
        var arr_in_csv = d3.csv.format(arr_data);
        var data_in_csv = arr_in_csv.replace(/\,/g, ';');        
        var file = new File([data_in_csv], "new.csv", {type: "text/plain;charset=utf-8"});
        saveAs(file);
    }
    
})