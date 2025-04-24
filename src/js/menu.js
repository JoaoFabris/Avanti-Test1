document.addEventListener("DOMContentLoaded", () => {
    // Seletores principais
    const btnAllCategories = document.querySelector(".btn-allCategories[data-bs-toggle='dropdown']");
    const departmentButtons = document.querySelectorAll(".department-item");
    const megaMenu = document.querySelector(".dropdown-menu.mega-menu");

    // Função para atualizar o estado dos itens de departamento
    function updateDepartmentItemsState() {
      const allCategoriesActive = btnAllCategories.classList.contains("active");
      const megaMenuActive = megaMenu && megaMenu.classList.contains("show");

      departmentButtons.forEach((item) => {
        item.classList.toggle("disabled", allCategoriesActive || megaMenuActive);
      });
    }
    

    // Função para resetar seleções
    const resetSelections = () => {
      document.querySelectorAll(".dropdown-submenu-content, .department-submenu").forEach((submenu) => {
        submenu.classList.remove("show");
      });

      document.querySelectorAll(".active-department, .active-category").forEach((el) => {
        el.classList.remove("active-department", "active-category");
      });

      if (!document.querySelector(".dropdown-menu.show, .department-submenu.show")) {
        document.querySelectorAll(".dropdown-item, .btn-allCategories").forEach((btn) => {
          btn.classList.remove("disabled", "disabled-force");
          btn.disabled = false;
        });
      }

      localStorage.removeItem("selectedDepartment");
      localStorage.removeItem("selectedCategory");
    };
    

    // Função para verificar o estado dos submenus
    function checkSubmenuState() {
      document.querySelectorAll(".department-submenu").forEach((submenu) => {
        const parentItem = submenu.closest('.department-item');
        parentItem.classList.toggle('active-department', submenu.classList.contains('show'));
        if (!submenu.classList.contains('show')) {
          parentItem.classList.remove('disabled');
        }
      });
    }

    // Evento de clique fora dos menus
    document.addEventListener("click", (e) => {
      const isInsideMenu = e.target.closest(".dropdown-submenu, .department-submenu, .department-item, .btn-allCategories, .nav-item");
      if (!isInsideMenu) {
        btnAllCategories.classList.remove("disabled-force");
        resetSelections();
        checkSubmenuState();
        updateDepartmentItemsState();
      }
    });

    // Listeners para botões de departamento
    departmentButtons.forEach((item) => {
      const button = item.querySelector(".dropdown-item");
      const submenu = item.querySelector(".department-submenu");

      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        btnAllCategories.classList.toggle("disabled-force");
        submenu.classList.toggle("show");
        
        if (submenu.classList.contains("show")) {
          button.classList.add("active-department");
          departmentButtons.forEach((btn) => {
            if (!btn.classList.contains("active-department")) {
              btn.classList.add("disabled");
            }
          });
        } else {
          button.classList.remove("active-department");
        }
      });
    });

    // Dropdowns de categorias
    const dropdownToggles = document.querySelectorAll(".dropdown-submenu > .dropdown-item");
    let activeSubmenu = null;
    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const submenu = this.nextElementSibling;
        console.log(dropdownToggles);
        if (activeSubmenu && activeSubmenu !== submenu) {
          activeSubmenu.classList.remove("show");
        }
        submenu.classList.toggle("show");
        activeSubmenu = submenu.classList.contains("show") ? submenu : null;
      });
    });

    // Dropdowns de departamentos
    const dropdownTogglesDepartament = document.querySelectorAll(".deparment-submenu > .dropdown-item");
    let activeSubmenuDepart = null;

    dropdownTogglesDepartament.forEach((toggle) => {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const submenu = this.nextElementSibling;

        if (activeSubmenuDepart && activeSubmenuDepart !== submenu) {
          activeSubmenuDepart.classList.remove("show");
        }

        submenu.classList.toggle("show");
        activeSubmenuDepart = submenu.classList.contains("show") ? submenu : null;
      });
    });

    // Controle de seleção para itens com data-category-id ou data-department-id
    document.querySelectorAll("[data-category-id], [data-department-id]").forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault();

        if (this.classList.contains("disabled")) return;

        document.querySelectorAll(".department-submenu.show").forEach((submenu) => {
          if (submenu !== this.closest(".department-submenu")) {
            submenu.classList.remove("show");
          }
        });

        document.querySelectorAll(".department-item").forEach((dept) => {
          if (!dept.classList.contains("active-department")) {
            dept.classList.add("disabled");
          }
        });

        document.querySelectorAll(".btn-allCategories").forEach((btn) => {
          btn.classList.add("disabled-force");
        });

        if (this.dataset.categoryId) {
          document.querySelectorAll(".active-category").forEach((el) => {
            el.classList.remove("active-category");
          });
          this.classList.add("active-category");

          const departmentId = this.dataset.categoryId.split("-")[0];
          const department = document.querySelector(`[data-department-id="${departmentId}"]`);
          if (department) {
            department.classList.add("active-department");
            document.querySelectorAll(".department-item:not(.active-department)").forEach((el) => {
              el.classList.add("disabled");
            });
          }

          localStorage.setItem("selectedCategory", this.dataset.categoryId);
        } else if (this.dataset.departmentId) {
          document.querySelectorAll(".active-department").forEach((el) => {
            el.classList.remove("active-department");
          });
          this.classList.add("active-department");

          localStorage.setItem("selectedDepartment", this.dataset.departmentId);

          document.querySelectorAll(".department-item:not(.active-department)").forEach((el) => {
            el.classList.add("disabled");
          });

          document.querySelectorAll(".btn-allCategories").forEach((btn) => {
            btn.classList.add("disabled-force");
          });
        }
      });
    });

    // Eventos para o botão "Todas as Categorias"
    const allCategoriesBtn = document.getElementById("btn-all-categories");
    allCategoriesBtn.addEventListener("show.bs.dropdown", () => {
      allCategoriesBtn.style.color = "#005cff";
    });
    allCategoriesBtn.addEventListener("hide.bs.dropdown", () => {
      allCategoriesBtn.style.color = "";
    });

    // Restaura o estado salvo no localStorage
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
      const category = document.querySelector(`[data-category-id="${savedCategory}"]`);
      if (category) category.classList.add("active-category");
    }

    const savedDepartment = localStorage.getItem("selectedDepartment");
    if (savedDepartment) {
      const department = document.querySelector(`[data-department-id="${savedDepartment}"]`);
      if (department) department.classList.add("active-department");
    }

    // Carrossel de produtos
    const carouselContainers = document.querySelectorAll(".carousel-container");

    carouselContainers.forEach((container) => {
      const carousel = container.querySelector(".product-grid");
      const dots = container.querySelectorAll(".carousel-dots .dot");
      const prevBtn = container.querySelector(".prev, .carousel-arrow.prev");
      const nextBtn = container.querySelector(".next, .carousel-arrow.next");
      let currentIndex = 0;

      function updateActiveDot() {
        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === currentIndex);
        });
      }

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          currentIndex = index;
          updateActiveDot();
          const scrollAmount = carousel.offsetWidth * 0.6;
          carousel.scrollTo({
            left: index * scrollAmount,
            behavior: "smooth",
          });
        });
      });

      const moveCarousel = (direction) => {
        const scrollAmount = carousel.offsetWidth * 0.6;
        carousel.scrollBy({
          left: direction * scrollAmount,
          behavior: "smooth",
        });

        if (direction === 1 && currentIndex < dots.length - 1) {
          currentIndex++;
        } else if (direction === -1 && currentIndex > 0) {
          currentIndex--;
        }

        updateActiveDot();
      };

      prevBtn.addEventListener("click", () => moveCarousel(-1));
      nextBtn.addEventListener("click", () => moveCarousel(1));
    });

    // Seções com cabeçalhos clicáveis
    document.querySelectorAll(".section h4").forEach((header) => {
      header.addEventListener("click", () => {
        const section = header.parentElement;
        section.classList.toggle("active");

        document.querySelectorAll(".section").forEach((otherSection) => {
          if (otherSection !== section) {
            otherSection.classList.remove("active");
          }
        });
      });
    });

    // Campo de busca
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    let lastSearch = '';

    function performSearch() {
      const searchTerm = searchInput.value.trim();

      if (!searchTerm) {
        alert('Por favor, digite algo para buscar');
        return;
      }

      lastSearch = searchTerm;

      searchInput.value = `Você procurou por: "${searchTerm}"`;
      searchInput.classList.add('searched');
    }

    searchButton.addEventListener('click', (e) => {
      e.preventDefault();
      performSearch();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });

    searchInput.addEventListener('focus', () => {
      searchInput.classList.add('focus-active');

      if (searchInput.classList.contains('searched')) {
        searchInput.value = '';
      }
    });
  });