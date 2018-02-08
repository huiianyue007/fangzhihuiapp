export default function ({store, redirect, error}) {
  let authToken = store.getters.getAuth
  if (!authToken) {
    redirect('/login')
  }
  // else {
  //   store.dispatch('getUserId').catch(() => {
  //     redirect('/login')
  //   })
  // }
}
