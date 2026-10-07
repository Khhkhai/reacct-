describe('user happy path', () => {
  const email = 'test1@example.com';
  const password = 'password';
  const name = 'Test User';

  const login = () => {
    cy.session('userSession', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type(password);
      cy.get('button[name="login-submit-button"]').click();
    });
  };

  const presentationName = 'Test Presentation';
  const description = 'This is a test presentation';

  const createNewPresentation = () => {
    cy.get('button[name="new-presentation-button"]').click();
    cy.get('input[name="name"]').type(presentationName);
    cy.get('input[name="description"]').type(description);
    cy.get('button[name="create-button"]').click();
  }

  const deletePresentation = () => {
    cy.get('button[name="delete-button"]').click();
    cy.get('button[name="delete-yes-button"]').click();
  }

  it('should navigate to the home screen successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.url().should('include', 'localhost:3000');
  });

  it('should navigate to the register page successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('button[name="register-button"]').click();
    cy.url().should('include', '/register');
  });

  it('should register successfully', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('input[name="name"]').type(name);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="confirm-password"]').type(password);
    cy.get('button[name="register-button"]').click();
    cy.url().should('include', '/dashboard');
  });


  it('should click new presentation button successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).should('be.visible');
    cy.contains(presentationName).click();
    deletePresentation();
  });

  it('should update the thumbnail and name of the presentation successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();

    // Open the presentation
    cy.contains(presentationName).click();
    cy.url().should('include', '/presentation');

    const newName = 'Updated Presentation Name';
    cy.get('svg[name="edit-name"]').click();
    cy.get('input[name="name"]').clear().type(newName);
    cy.get('button[name="title-confirm-button"]').click();
    cy.contains('h1', newName).should('be.visible');

    cy.get('#edit-thumbnail').click();
    cy.get('input[name="thumbnail"]').selectFile('cypress/fixtures/thumbnail.jpeg', { force: true });
    cy.get('button[name="thumbnail-confirm-button"]').click();
    cy.get('#edit-thumbnail img').should('have.attr', 'src').and('include', 'data:image/jpeg;base64');
    deletePresentation();
  });

  it('should add slides to the presentation successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();

    cy.get('button[name="create-slide-button"]').click();
    cy.get('button[name="create-slide-button"]').click();
    cy.get('button[name="create-slide-button"]').click();

    // "Slide X of Y" paragraph confirms slide count
    cy.contains('p', 'Slide 4 of 4').should('be.visible');
    deletePresentation();
  });


  it('should switch between slides successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();

    cy.get('button[name="create-slide-button"]').click();
    cy.get('button[name="create-slide-button"]').click();

    cy.contains('p', 'Slide 3 of 3').should('be.visible');

    cy.get('button[name="previous-slide-button"]').click();
    cy.wait(500);
    cy.contains('p', 'Slide 2 of 3').should('be.visible');

    cy.get('button[name="previous-slide-button"]').click();
    cy.wait(500);
    cy.contains('p', 'Slide 1 of 3').should('be.visible');

    deletePresentation();
  });

  it('should delete the presentation successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    createNewPresentation();
    cy.contains(presentationName).click();
    deletePresentation();
    cy.url().should('include', '/dashboard');
    cy.contains(presentationName).should('not.exist');
  });

  it('should logout successfully', () => {
    login();
    cy.visit('http://localhost:3000/dashboard');
    cy.get('button[name="logout-button"]').click();
    cy.url().should('include', '/');
  });

  it('should navigate to the login page successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('button[name="login-button"]').click();
    cy.url().should('include', '/login');
  });

  it('should login successfully', () => {
    cy.visit('http://localhost:3000/');
    login();
    cy.visit('http://localhost:3000/dashboard');
    cy.url().should('include', '/dashboard');
  });
});
