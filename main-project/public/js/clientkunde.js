$(document).ready(function() {
    $('#submitknap').click(saveProfil)

    function validateInputs(){
        let valid = true
        let formData = $('form').serializeArray()
        let i = 0
        while(valid && i<formData.length){
            switch(formData[i].name){
                case 'fornavn':
                if(formData[i].value == '')
                    valid = false
                break;

                case 'efternavn':
                if(formData[i].value == '')
                    valid = false
                break;

                case 'firma':
                if(formData[i].value == '')
                    valid = false
                break;

                default:
                    valid = true
            }
            i++;
        }       
        return valid
    }

    function saveProfil(){
        if(validateInputs())
            $('#profilform').submit()
        else
            alert('Alle felter skal være udfyldt')
    }
})