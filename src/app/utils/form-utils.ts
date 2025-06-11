import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

async function sleep(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 2500);
    })
}

export class FormUtils {

    static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
    static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
    
    static getTextError(errors: ValidationErrors): string | null{
        for(const key of Object.keys(errors)){
            switch(key){
                case 'required':
                    return 'Este campo es requerido';
                case 'minlength':
                    return `Minimo de ${ errors['minlength'].requiredLength } caracteres.`
                case 'min':
                    return `Valor minimo de ${ errors['min'].min }`;
                case 'email':
                    return `El email debe tener un formato correcto!`;
                case 'emailTaken':
                    return `El email ya esta siendo usado por otro usuario!`;
                case 'userTaken':
                    return `El username ya esta siendo usado por otro usuario!`;
                case 'pattern':
                    if(errors['pattern'].requiredPattern == FormUtils.emailPattern){
                        return 'El correo electronico no parece un correo valido';
                    }
                    return 'El campo no cumple con la validacion';
                default:
                    return 'El valor del campo no tiene la estructura correcta!'
            }
        }
        return null;
    }

    static isValidField(form:FormGroup, fieldName:string):boolean|null {
        return (form.controls[fieldName].errors && form.controls[fieldName].touched);
    }

    static getFieldError(form:FormGroup, fieldName:string):string|null{
        if(!form.controls[fieldName]) return null;
        const errors = form.controls[fieldName].errors ?? {};
        return this.getTextError(errors);

    }

    static isValidFieldInArray(formArray: FormArray, index:number){
        return (
        formArray.controls[index].errors && formArray.controls[index].touched
        )
    }

    static getFieldErrorInArray(formArray:FormArray, index:number):string|null{
        if(formArray.controls.length == 0) return null;
        const errors = formArray.controls[index].errors ?? {};
         return this.getTextError(errors);
    }

    static isFiledOneEqualFieldTwo(field1:string, field2: string){
        return (formGroup: AbstractControl) => {
        const fieldValue = formGroup.get(field1)?.value;
        const fieldValue2 = formGroup.get(field2)?.value;

        return fieldValue == fieldValue2 ? null : {passwordsNotEqual:true}
        }
    }
    
    static async checkingSErverResponse(control: AbstractControl): Promise<ValidationErrors | null>{
        console.log('validando el formulario contra servidor');
        await sleep(); //se espera dos segundos y medio
        const formValue = control.value;
        if(formValue === 'hola@mundo.com'){
            return {
                emailTaken: true
            }
        }
        return null
    }

    static validarUsername(control: AbstractControl): ValidationErrors | null{
        const formValue = control.value;
        if(formValue === 'osmolik'){
            return {
                userTaken: true
            }
        }
        return null
    }

}