/* eslint-disable jsx-a11y/anchor-is-valid */
import firebase from 'firebase/app'
import Popper from "popper.js";
import Header from './Header.js'
import Modal from './Modal.js'
import 'firebase/auth'
import 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useState, useEffect, createRef, useRef } from 'react'

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
const firestore = firebase.firestore()
const ATTENDEE_DOCUMENT_REF = 'attendees'

function App() {
  const [isModalOpen, setIsOpen] = useState(false)
  const [attendeeModal, setAttendeeModal] = useState({id: '', firstName: '', lastName: '', whatsapp: '', email: '', dni: '', pagadoA: '', invitadoDe: '', medioDePago: '', comentario: ''})
  const [user] = useAuthState(auth)
  return (
    <>
      { user && <Header setAttendeeModal={setAttendeeModal} setIsOpen={setIsOpen} /> }
      { user ? <Table setAttendeeModal={setAttendeeModal} setIsOpen={setIsOpen} /> : <SignIn /> }
      <Modal setIsOpen={setIsOpen} setAttendeeModal={setAttendeeModal} attendeeModal={attendeeModal} open={isModalOpen} />
      
    </>
  );
}

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const signInWithEmailAndPassword = async(e) => {
    e.preventDefault()
    if (!email || !password) {
      return
    }
    try {
      await auth.signInWithEmailAndPassword(email,password)
    } catch (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        setError('Usuario y/o Contraseña Erronea.');
      } else {
        setError('Usuario y/o Contraseña Erronea.');
        console.log(errorCode, errorMessage);
      }
    }
  }


  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <svg fill="none" className="mx-auto h-12 w-auto" viewBox="0 0 35 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4f46e5" d="M15.258 26.865a4.043 4.043 0 01-1.133 2.917A4.006 4.006 0 0111.253 31a3.992 3.992 0 01-2.872-1.218 4.028 4.028 0 01-1.133-2.917c.009-.698.2-1.382.557-1.981.356-.6.863-1.094 1.47-1.433-.024.109.09-.055 0 0l1.86-1.652a8.495 8.495 0 002.304-5.793c0-2.926-1.711-5.901-4.17-7.457.094.055-.036-.094 0 0A3.952 3.952 0 017.8 7.116a3.975 3.975 0 01-.557-1.98 4.042 4.042 0 011.133-2.918A4.006 4.006 0 0111.247 1a3.99 3.99 0 012.872 1.218 4.025 4.025 0 011.133 2.917 8.521 8.521 0 002.347 5.832l.817.8c.326.285.668.551 1.024.798.621.33 1.142.826 1.504 1.431a3.902 3.902 0 01-1.504 5.442c.033-.067-.063.036 0 0a8.968 8.968 0 00-3.024 3.183 9.016 9.016 0 00-1.158 4.244zM19.741 5.123c0 .796.235 1.575.676 2.237a4.01 4.01 0 001.798 1.482 3.99 3.99 0 004.366-.873 4.042 4.042 0 00.869-4.386 4.02 4.02 0 00-1.476-1.806 3.994 3.994 0 00-5.058.501 4.038 4.038 0 00-1.175 2.845zM23.748 22.84c-.792 0-1.567.236-2.226.678a4.021 4.021 0 00-1.476 1.806 4.042 4.042 0 00.869 4.387 3.99 3.99 0 004.366.873A4.01 4.01 0 0027.08 29.1a4.039 4.039 0 00-.5-5.082 4 4 0 00-2.832-1.18zM34 15.994c0-.796-.235-1.574-.675-2.236a4.01 4.01 0 00-1.798-1.483 3.99 3.99 0 00-4.367.873 4.042 4.042 0 00-.869 4.387 4.02 4.02 0 001.476 1.806 3.993 3.993 0 002.226.678 4.003 4.003 0 002.832-1.18A4.04 4.04 0 0034 15.993z"/>
            <path fill="#4f46e5" d="M5.007 11.969c-.793 0-1.567.236-2.226.678a4.021 4.021 0 00-1.476 1.807 4.042 4.042 0 00.869 4.386 4.001 4.001 0 004.366.873 4.011 4.011 0 001.798-1.483 4.038 4.038 0 00-.5-5.08 4.004 4.004 0 00-2.831-1.181z"/>
          </svg>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciá Sesión a Tu Cuenta
          </h2>
        </div>
        <form onSubmit={signInWithEmailAndPassword} className="mt-8 space-y-6" action="#" method="POST">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Correo Electrónico" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input value={password} onChange={e => setPassword(e.target.value)} id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Contraseña" />
            </div>
          </div>
          {error && <div className="text-center">
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>}
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Table({setAttendeeModal, setIsOpen}) {
  const attendeesRef = firestore.collection(ATTENDEE_DOCUMENT_REF)
  const query = attendeesRef.orderBy('createdAt')

  const [attendees] = useCollectionData(query, {idField: 'id'})

  return (
    <section className="max-w-7xl mx-auto pt-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {attendees && attendees.map(attendee => <Attendee setAttendeeModal={setAttendeeModal} setIsOpen={setIsOpen} key={attendee.id} attendee={attendee}/>)}
        </ul>
      </div>
    </section>
  );
}

function Attendee({setAttendeeModal, setIsOpen, attendee}) {
  const {id, firstName, lastName, dni, email, whatsapp, pagadoA, invitadoDe, medioDePago, comentario, createdAt} = attendee

  const editAttendee = (e) => {
    e.preventDefault()

    setAttendeeModal({id, firstName, lastName, whatsapp, email, dni, pagadoA, invitadoDe, medioDePago, comentario})
    setIsOpen(true)
  }

  return (
    <li>
      <div className="block">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-indigo-600 truncate">
              {firstName} {lastName}
            </p>
            <div className="ml-2 flex-shrink-0 flex">
              <p onClick={editAttendee} className="cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 hover:bg-green-200 text-green-800">
                Editar
              </p>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {email}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                {whatsapp}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                {dni}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {invitadoDe}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {medioDePago}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                {pagadoA}
              </p>
            </div>
            <div className="sm:flex">
              {comentario && <Popover comentario={comentario}/>}
              {createdAt && (
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <p>
                    Agregado el
                    <time dateTime={createdAt.toDate().toString()}>{` ${createdAt.toDate().getDay()}/${createdAt.toDate().getMonth() + 1}`}</time>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

const Popover = ({ comentario }) => {
  const [popoverShow, setPopoverShow] = useState(false);
  const iconEl = useRef(null);
  const btnRef = createRef();
  const popoverRef = createRef();
  const openPopover = () => {
    new Popper(btnRef.current, popoverRef.current, {
      placement: "top"
    });
    setPopoverShow(true);
  };
  const closePopover = () => {
    setPopoverShow(false);
  };

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
        if (iconEl.current && !iconEl.current.contains(event.target) && popoverShow) {
          setPopoverShow(false);
        }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [iconEl, popoverShow]);
  return (
    <div 
      onClick={() => {
        popoverShow ? closePopover() : openPopover();
      }}
      ref={btnRef} className="cursor-pointer mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:mr-6">
      <svg ref={iconEl} className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
      <div
        className={
          (popoverShow ? "" : "hidden ") +
          "bg-gray-700 border-0 mb-3 block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg"
        }
        ref={popoverRef}
      >
        <div className="text-gray-50 p-3">
          {comentario}
        </div>
      </div>
    </div>
  );
};

export default App;
