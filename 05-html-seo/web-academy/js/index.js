// --- LOGICA MODO ESTRUCTURA / DEVTOOLS ---
        const toggleStructureBtn = document.getElementById('toggleStructureBtn');
        const pageContainer = document.getElementById('pageContainer');
        const btnText = document.getElementById('btnText');

        let isStructureMode = false;

        toggleStructureBtn.addEventListener('click', () => {
            isStructureMode = !isStructureMode;
            if (isStructureMode) {
                pageContainer.classList.add('show-structure');
                toggleStructureBtn.classList.add('btn-toggle-active');
                btnText.textContent = 'Desactivar Modo Estructura';
            } else {
                pageContainer.classList.remove('show-structure');
                toggleStructureBtn.classList.remove('btn-toggle-active');
                btnText.textContent = 'Activar Modo Estructura / DevTools';
            }
        });

        // --- ACORDEÓN INTERACTIVO PARA "TU TURNO" ---
        const accordionHeaders = document.querySelectorAll('.accordion-header');

        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                item.classList.toggle('active');
            });
        });

        // --- DEMO TURNO 2: MARGIN & PADDING SLIDERS ---
        const paddingInput = document.getElementById('paddingInput');
        const marginInput = document.getElementById('marginInput');
        const paddingVal = document.getElementById('paddingVal');
        const marginVal = document.getElementById('marginVal');
        const demoCard1 = document.getElementById('demoCard1');
        const demoCard2 = document.getElementById('demoCard2');

        function updateBoxModel() {
            const p = paddingInput.value + 'px';
            const m = marginInput.value + 'px';

            paddingVal.textContent = p;
            marginVal.textContent = m;

            [demoCard1, demoCard2].forEach(card => {
                card.style.padding = p;
                card.style.margin = m;
            });
        }

        paddingInput.addEventListener('input', updateBoxModel);
        marginInput.addEventListener('input', updateBoxModel);

        // --- DEMO TURNO 3: FLEXBOX TOGGLE ---
        const toggleFlexBtn = document.getElementById('toggleFlexBtn');
        const demoFlexList = document.getElementById('demoFlexList');
        let isFlex = false;

        toggleFlexBtn.addEventListener('click', () => {
            isFlex = !isFlex;
            if (isFlex) {
                demoFlexList.style.display = 'flex';
                demoFlexList.style.gap = '1.5rem';
                toggleFlexBtn.textContent = 'Cambiar a display: block (Vertical)';
                toggleFlexBtn.style.backgroundColor = '#d97706';
            } else {
                demoFlexList.style.display = 'block';
                demoFlexList.style.gap = '0';
                toggleFlexBtn.textContent = 'Cambiar a display: flex (Horizontal)';
                toggleFlexBtn.style.backgroundColor = '#0284c7';
            }
        });

        // --- DEMO TURNO 4: REM VS PX ---
        function setBaseFontSize(size) {
            document.documentElement.style.fontSize = size;
        }