// LibCommon

export default {
    string_to_obj:function(items){
        var ret = [];
        items.forEach(function(item){
            var row = JSON.parse(item || '[]')
    //        console.log( row );
            ret.push( row )
        });
        return ret;        
    },    

}