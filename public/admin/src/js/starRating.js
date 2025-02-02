export function createRating(container, options = {}) {
    const { readonly = false, value = 0 } = options;
    let currentRating = value;

    function render() {
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = `star ${i <= currentRating ? 'active' : ''}`;
            star.innerHTML = '★';

            if (!readonly) {
                star.addEventListener('click', () => {
                    currentRating = i;
                    render();
                });
            }

            container.appendChild(star);
        }
    }

    render();

    return {
        getValue: () => currentRating,
        reset: () => {
            currentRating = 0;
            render();
        }
    };
}