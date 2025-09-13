function Logo () {
    return (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="#4F46E5" />
        <path
          d="M90 50 L90 150 M110 50 L110 150"
          stroke="#FFFFFF"
          stroke-width="6"
          stroke-linecap="round"
        />
        <path
          d="M75 75 Q75 60 100 60 Q125 60 125 75 Q125 90 100 90 Q75 90 75 110 Q75 125 100 125 Q125 125 125 110"
          fill="none"
          stroke="#FFFFFF"
          stroke-width="6"
          stroke-linecap="round"
        />
      </svg>
    );
}

export default Logo;