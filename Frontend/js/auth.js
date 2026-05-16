async function login() {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            action: "login",
            email,
            senha
        })
    });

    const data = await response.json();

    if(data.success) {
        localStorage.setItem("logado", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("Login inválido");
    }
}

function logout() {
    localStorage.removeItem("logado");
    window.location.href = "index.html";
}