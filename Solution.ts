/*Solution

SOLID Principles:
Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones) pero cerradas para modificación.
Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir por cualquier otro objeto que también implemente la interfaz.
Dependency Inversion Principle: Se inyecta IEmailService en LibraryManager, lo que significa que LibraryManager no depende de una implementación concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario*/


class Book {
    constructor(public title: string, public author: string, public ISBN: string) { }
}

class BookBuilder {
    private title: string = "";
    private author: string = "";
    private ISBN: string = "";

    withTitle(title: string): BookBuilder {
        this.title = title;
        return this;
    }

    withAuthor(author: string): BookBuilder {
        this.author = author;
        return this;
    }

    withISBN(ISBN: string): BookBuilder {
        this.ISBN = ISBN;
        return this;
    }

    build(): Book {
        return new Book(this.title, this.author, this.ISBN);
    }
}

//notificar a los usuarios al salir un nuevo libro
interface Notifier {
    sendNotification(userID: string, message: string): void;
}
class EmailNotifier implements Notifier {
    sendNotification(userID: string, message: string) {
        console.log(`Enviando email a ${userID}: ${message}`);
        //envío de correo electrónico aquí
    }
}
//usuario-------------------------------------------------
interface Observer {
    update(book: Book): void;
}

// representar 
class User implements Observer {
    constructor(public userID: string) { }

    update(book: Book) {
        console.log(`Usuario ${this.userID} ha sido notificado sobre el nuevo libro: ${book.title}`);
    }
}

class LibraryManager {
    private books: Book[] = [];
    private loans: Loan[] = [];

    constructor(private notifier: Notifier) { }

    addBook(title: string, author: string, ISBN: string) {
        const book = new Book(title, author, ISBN);
        this.books.push(book);
        this.notifyObservers(book); //notificar usuario
    }

    removeBook(ISBN: string) {
        const index = this.books.findIndex(book => book.ISBN === ISBN);
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }

    search(query: string): Book[] {
        return this.books.filter(book =>
            book.title.includes(query) ||
            book.author.includes(query) ||
            book.ISBN === query
        );
    }

    loanBook(ISBN: string, userID: string) {
        const book = this.books.find(book => book.ISBN === ISBN);
        if (book) {
            this.loans.push(new Loan(book, userID));
            this.notifier.sendNotification(userID, `Has solicitado el libro ${book.title}`);
        }
    }

    returnBook(ISBN: string, userID: string) {
        const index = this.loans.findIndex(loan => loan.book.ISBN === ISBN && loan.userID === userID);
        if (index !== -1) {
            const loan = this.loans.splice(index, 1)[0];
            this.notifier.sendNotification(userID, `Has devuelto el libro con ISBN ${loan.book.ISBN}. ¡Gracias!`);
        }
    }
    private observers: Observer[] = [];

    // registro para observadores
    registerObserver(observer: Observer) {
        this.observers.push(observer);
    }

    // notificar a todos los observadores sobre un nuevo libro
    private notifyObservers(book: Book) {
        this.observers.forEach(observer => {
            observer.update(book);
        });
    }


}

// clase para representar un préstamo de libro
class Loan {
    constructor(public book: Book, public userID: string, public date = new Date()) { }
}

// notificador de correo electrónico
const emailNotifier = new EmailNotifier();

// administrador de la biblioteca con el notificador
const library = new LibraryManager(emailNotifier);

//añadir/crear usuario
const user1 = new User("user01");
const user2 = new User("user02");

// Registrar usuario observador
library.registerObserver(user1);
library.registerObserver(user2);



// Agrega libros y realiza préstamos
library.addBook("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
library.addBook("1984", "George Orwell", "987654321");
library.addBook("El Señor de los Anillos", "J.R.R. Tolkien", "555555555");
library.loanBook("123456789", "user01");

this.observers.forEach(observer => observer.update(Book));


