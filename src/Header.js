/* eslint-disable jsx-a11y/anchor-is-valid */
import firebase from 'firebase/app'
import 'firebase/auth'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCrXTZO5ANnkxX6LH2AIStwYY94cFS90nE",
    authDomain: "navidad-cbac1.firebaseapp.com",
    projectId: "navidad-cbac1",
    storageBucket: "navidad-cbac1.appspot.com",
    messagingSenderId: "793154832020",
    appId: "1:793154832020:web:e33dfa2bcd1b0ee2975681"
  })
}

const auth = firebase.auth()

function Header({setAttendeeModal, setIsOpen}) {
  return (
    <header className="relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className="flex items-center justify-end md:flex-1 lg:w-0">
            <AddAttendee setAttendeeModal={setAttendeeModal} setIsOpen={setIsOpen} />
            <SignOut />
          </div>
        </div>
      </div>

    </header>
  );
}

function SignOut() {
  return auth.currentUser && (
    <a href="#" onClick={() => auth.signOut()} className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
      Cerrar Sesión
    </a>
  );
}

function AddAttendee({setAttendeeModal, setIsOpen}) {
  const addAttendee = (e) => {
    e.preventDefault()

    setAttendeeModal({id: '', firstName: '', lastName: '', whatsapp: '', email: '', dni: '', pagadoA: '', invitadoDe: '', medioDePago: '', comentario: ''})
    setIsOpen(true)
  }

  return (
    <a href="#" onClick={addAttendee} className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
      Agregar Invitado
    </a>
  );
  
}

export default Header;