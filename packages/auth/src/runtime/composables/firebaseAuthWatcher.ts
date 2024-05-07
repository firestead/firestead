import { onMounted, watch, useRoute, useRouter, useCurrentUser } from '#imports'

/** 
 * this composable is used to watch the user object and redirect the user to the correct page
 * based on their authentication status
 * if the user is logged out, redirect them to the login page
 * if the user is logged in, redirect them to the home page
 * if the user is logged in and has a redirect query param, redirect them to the redirect query param
**/
export default function firebaseAuthWatcher() {
    const router = useRouter()
    const route = useRoute()
    const user = useCurrentUser()
    
    onMounted(() => {
        watch(user, (user, prevUser) => {
            if (prevUser && !user) {
                // user logged out
                router.push('/login')
            } else if (user && typeof route.query.redirect === 'string') {
                // user logged in
                // decode the redirect query param
                router.push(decodeURIComponent(route.query.redirect))
            } else {
                // user logged in
                router.push('/')
            }
        })
    })
}