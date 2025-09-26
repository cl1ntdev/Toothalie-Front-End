class LoginedUserClass {
  firstname: string
  lastname: string
  role: string
  id: string
  
  constructor(firstname:string,lastname:string,role:string,id: string){
    this.firstname= firstname
    this.lastname= lastname
    this.role= role
    this.id= id
  }
}

export {LoginedUserClass}