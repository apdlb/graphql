const useAuth = () => {
  const isAuthenticated = () => {
    return localStorage.getItem("jwtToken") ? true : false;
  };

  return {
    isAuthenticated
  };
};

export default useAuth;
