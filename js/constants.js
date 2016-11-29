angular.module('tcw.constants', [])	

.constant('BASE_URL', 'https://somewebsite.com/v1')

.constant('AUTH_EVENTS', {
	updateUser: 'update-user',
	notAuthorized: 'auth-not-authorized',
})

.constant('USER_ROLES', {
	user: 'user',
	//guest: 'guest',
});
