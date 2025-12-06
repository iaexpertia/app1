const form = document.getElementById('updatePasswordForm');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const updateBtn = document.getElementById('updateBtn');
const btnText = document.getElementById('btnText');
const passwordError = document.getElementById('passwordError');
const confirmError = document.getElementById('confirmError');

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function hideError(element) {
    element.classList.remove('show');
}

function setLoading(isLoading) {
    updateBtn.disabled = isLoading;
    newPasswordInput.disabled = isLoading;
    confirmPasswordInput.disabled = isLoading;

    if (isLoading) {
        btnText.innerHTML = '<span class="loading"></span>Actualizando...';
    } else {
        btnText.textContent = 'Actualizar Contraseña';
    }
}

newPasswordInput.addEventListener('input', () => {
    hideError(passwordError);
});

confirmPasswordInput.addEventListener('input', () => {
    hideError(confirmError);
});

(async function verificarSesion() {
    try {
        const { data: { session } } = await window.supabase.auth.getSession();

        if (!session) {
            alert('El enlace de recuperación ha expirado o no es válido. Por favor, solicita uno nuevo.');
            window.location.href = 'https://cyclepeaks.com/auth/forgot-password.html';
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
    }
})();

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    hideError(passwordError);
    hideError(confirmError);

    const newPassword = newPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (newPassword.length < 6) {
        showError(passwordError, 'La contraseña debe tener al menos 6 caracteres');
        newPasswordInput.focus();
        return;
    }

    if (newPassword !== confirmPassword) {
        showError(confirmError, 'Las contraseñas no coinciden');
        confirmPasswordInput.focus();
        return;
    }

    setLoading(true);

    try {
        const { data: { session } } = await window.supabase.auth.getSession();

        if (!session || !session.user || !session.user.email) {
            throw new Error('No se pudo obtener la información del usuario. La sesión puede haber expirado.');
        }

        const email = session.user.email;

        const { data: authData, error: authError } = await window.supabase.auth.updateUser({
            password: newPassword
        });

        if (authError) {
            throw authError;
        }

        const { error: dbError } = await window.supabase
            .from('cyclists')
            .update({ password: newPassword })
            .eq('email', email);

        if (dbError) {
            console.error('Error actualizando tabla cyclists:', dbError);
            throw new Error('La contraseña se actualizó en el sistema de autenticación, pero hubo un problema al sincronizar con la base de datos.');
        }

        alert('Contraseña actualizada con éxito');

        setTimeout(() => {
            window.location.href = 'https://cyclepeaks.com';
        }, 500);

    } catch (error) {
        console.error('Error al actualizar contraseña:', error);

        let errorMessage = 'Ocurrió un error al actualizar la contraseña. Por favor, inténtalo de nuevo.';

        if (error.message) {
            if (error.message.includes('same as the old password')) {
                errorMessage = 'La nueva contraseña no puede ser igual a la anterior.';
            } else if (error.message.includes('session') || error.message.includes('sesión')) {
                errorMessage = 'La sesión ha expirado. Por favor, solicita un nuevo enlace de recuperación.';
            } else {
                errorMessage = error.message;
            }
        }

        alert('Error: ' + errorMessage);
        showError(passwordError, errorMessage);
        setLoading(false);
    }
});
