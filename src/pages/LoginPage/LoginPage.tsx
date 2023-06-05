export default function LoginPage() {
    return (
        <>
            <form action="">
                <label>
                    email
                    <input placeholder="john.doe@email.com"></input>
                </label>
                
                <label>
                    password
                    <input placeholder="password" type="password"></input>
                </label>
                
                <button type='submit'>Login</button>
            </form>
        </>
    )
}