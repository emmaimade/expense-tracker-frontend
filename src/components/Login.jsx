import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Logo from './Logo';
function Login () {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/register');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login submitted");
        navigate('/dashboard'); // Redirect to dashboard after login
    }

    return (
      <div className="Login justify-center border-2 border-gray-300 rounded-lg p-6 max-w-md mx-auto mt-10 bg-white shadow-md">
        <div className="Logo size-12 flex justify-center mx-auto mb-6">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Welcome Back!</h1>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EmailIcon className="text-gray-400" fontSize="small" />
              </div>
              <input
                type="email"
                id="email"
                className="block w-full pl-10 h-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="text-gray-400" fontSize="small" />
              </div>
              <input
                type="password"
                id="password"
                className="block w-full pl-10 h-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow-sm"
          >
            Sign in
          </button>
        </form>

        {/* Google OAuth Button */}
        <button
          type="button"
          className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 mt-4"
          onClick={() => {
            // Your Google OAuth logic
            console.log("Google OAuth clicked");
          }}
        >
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
            <button
              type="button"
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 bg-transparent border-none cursor-pointer"
              onClick={handleSignUp}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    );
}

export default Login