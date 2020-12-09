// import { Transition } from "@headlessui/react";
import firebase from 'firebase/app'
import { useState, useEffect } from 'react'
import PhoneInput from 'react-phone-number-input/input'
import { isValidPhoneNumber } from 'react-phone-number-input'

import 'firebase/firestore'

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

const firestore = firebase.firestore()
const auth = firebase.auth()
const ATTENDEE_DOCUMENT_REF = 'attendees'

function Modal({open, setIsOpen, setAttendeeModal, attendeeModal}) {
  const attendeesRef = firestore.collection(ATTENDEE_DOCUMENT_REF)
  const [error, setError] = useState('')
  const [attendee, setAttendee] = useState({id: '', firstName: '', lastName: '', whatsapp: '', email: '', dni: '', pagadoA: 'Fer', invitadoDe: 'Fer', medioDePago: 'Efectivo', comentario: ''})

  useEffect(() => {
    if(attendeeModal.id) {
      setAttendee({...attendee, ...attendeeModal})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendeeModal]);

  const addAttendee = async(e) => {
    e.preventDefault()
    const {uid} = auth.currentUser
    const {firstName, lastName, dni, email, whatsapp, pagadoA, invitadoDe, medioDePago} = attendee

    if (!firstName || !lastName || !whatsapp || !email || !dni || !pagadoA || !invitadoDe || !medioDePago) {
      setError('Falta Rellenar todos los campos')
      return 
    }

    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (!re.test(String(email).toLowerCase())) {
      setError('El email es incorrecto')
      return 
    }

    if (!isValidPhoneNumber(whatsapp)) {
      console.log(whatsapp)
      setError('El whatsapp es incorrecto')
      return 
    }

    if (dni.length !== 8) {
      setError('El DNI es incorrecto')
      return 
    }

    const { id, ...attendeeToUpload } = attendee;

    if(attendeeModal.id) {
      await attendeesRef.doc(attendeeModal.id).set({
        ...attendeeToUpload,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: uid
      }, {merge: true})
    } else {
      await attendeesRef.add({
        ...attendeeToUpload,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: uid
      })
    }

    setAttendee({id: '', firstName: '', lastName: '', whatsapp: '', email: '', dni: '', pagadoA: 'Fer', invitadoDe: 'Fer', medioDePago: 'Efectivo', comentario: ''})
    setAttendeeModal({id: '', firstName: '', lastName: '', whatsapp: '', email: '', dni: '', pagadoA: '', invitadoDe: '', medioDePago: '', comentario: ''})
    setIsOpen(false)
    setError(false)
  }

  return open && (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 transition-opacity" aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline"
        >
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="mt-3 sm:mt-5">
              <h3 className="text-center text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                {attendeeModal.id ? 'Editar' : 'Agregar'} Nuevo Invitado
              </h3>
              <div className="mt-10 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <div className="mt-1">
                    <input value={attendee.firstName} onChange={(e) => setAttendee({...attendee, firstName: e.target.value})} type="text" name="first_name" id="first_name" autoComplete="given-name" className="py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
                  <div className="mt-1">
                    <input value={attendee.lastName} onChange={(e) => setAttendee({...attendee, lastName: e.target.value})} type="text" name="last_name" id="last_name" autoComplete="family-name" className="py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">DNI</label>
                  <div className="mt-1">
                    <input value={attendee.dni} onChange={(e) => setAttendee({...attendee, dni: e.target.value})} type="text" name="company" id="company" autoComplete="organization" className="py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="mt-1">
                    <input value={attendee.email} onChange={(e) => setAttendee({...attendee, email: e.target.value})} id="email" name="email" type="email" autoComplete="email" className="py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Whatsapp</label>
                  <div className="mt-1">
                    <PhoneInput
                      international
                      withCountryCallingCode
                      placeholder="+54 11 4593 0404"
                      value={attendee.whatsapp} 
                      onChange={value => setAttendee({...attendee, whatsapp: value})}
                      type="text" name="phone_number" id="phone_number" autoComplete="tel" className="py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                      />
                  </div>
                </div>
                <div>
                  <label htmlFor="invitadoDe" className="block text-sm font-medium text-gray-700">Invitado de</label>
                  <select value={attendee.invitadoDe} onChange={(e) => setAttendee({...attendee, invitadoDe: e.target.value})} id="invitadoDe" name="invitadoDe" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option>Fer</option>
                    <option>Nicolás</option>
                    <option>Alan</option>
                    <option>Paco</option>
                    <option>Tincho</option>
                    <option>Tomás</option>
                    <option>Juani</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="medioDePago" className="block text-sm font-medium text-gray-700">Medio de Pago</label>
                  <select value={attendee.medioDePago} onChange={(e) => setAttendee({...attendee, medioDePago: e.target.value})} id="medioDePago" name="medioDePago" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option>Efectivo</option>
                    <option>MercadoPago</option>
                    <option>Transferencia</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pagadoA" className="block text-sm font-medium text-gray-700">Pagado A</label>
                  <select value={attendee.pagadoA} onChange={(e) => setAttendee({...attendee, pagadoA: e.target.value})} id="pagadoA" name="pagadoA" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option>Fer</option>
                    <option>Nicolás</option>
                    <option>Alan</option>
                    <option>Paco</option>
                    <option>Tincho</option>
                    <option>Tomás</option>
                    <option>Juani</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comentario</label>
                  <div className="mt-1">
                    <input value={attendee.comentario} onChange={(e) => setAttendee({...attendee, comentario: e.target.value})} id="comment" name="comment" type="text" className="py-2 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="mt-2 text-sm text-center text-red-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button onClick={addAttendee} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
              {attendeeModal.id ? 'Editar' : 'Agregar'}
            </button>
            <button onClick={() => setIsOpen(false)} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;