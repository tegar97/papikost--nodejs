const login = async(email,password) =>{
    console.log(email,password)
    try {
        const res= await axios({
            method : 'POST',
            url : 'http://127.0.0.1:3000/api/v1/users/login',
            data :{
                email,
                password
            }
        })
        console.log(res)
    } catch (error) {
        console.log(error.response.data)
        
    }
   
}
document.querySelector('.form-login').addEventListener('submit',e =>{
    e.preventDefault()
    const email = document.getElementById('emailLogin').value
    const password = document.getElementById('passwordLogin').value
    console.log(email,password)
    login(email,password)


})