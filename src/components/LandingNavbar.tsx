import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X, Sparkles, Bell } from 'lucide-react';
import suzlonnav from "../assets/suzlon-nav.png"

const LandingNavbar = () => {
    const [showProductsDropdown, setShowProductsDropdown] = useState(false);
    const [showPricingDropdown, setShowPricingDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showComingSoonModal, setShowComingSoonModal] = useState(false);
    const [comingSoonFeature, setComingSoonFeature] = useState('');
    const productsDropdownRef = useRef<HTMLDivElement>(null);
    const pricingDropdownRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
                setShowProductsDropdown(false);
            }
            if (pricingDropdownRef.current && !pricingDropdownRef.current.contains(event.target as Node)) {
                setShowPricingDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleComingSoon = (featureName: string) => {
        setComingSoonFeature(featureName);
        setShowComingSoonModal(true);
        setShowProductsDropdown(false);
        setShowMobileMenu(false);
    };

    const productsData = {
        solutions: [
            'GST Billing Software',
            'Invoicing Software',
            'Quotation Software',
            'e-Invoicing Software',
            'eWay Bill Software',
            'Inventory Software',
            'Invoicing API'
        ],
        freeTools: [
            { name: 'GST Invoice Maker', route: '/invoice/gst-invoice' },
            { name: 'Invoice Generator', route: '/invoice/invoice-generator' },
            { name: 'Quotation Generator', route: '/invoice/quotation' },
            { name: 'Create Proforma Invoice', route: '/invoice/proforma-invoice' },
            { name: 'Invoice Formats', route: null },
            { name: 'Create Purchase Order', route: '/invoice/purchase-order' },
            { name: 'Create Delivery Challan', route: '/invoice/delivery-challan' },
            { name: 'Quotation Templates', route: null },
        ],
        categories: [
            'Startups',
            'Chartered Accountant',
            'Export/Import Business',
            'Professional Services',
            'Freelancers/Self-Employed'
        ]
    };

    return (
        <>
            {/* Full-width teal navbar */}
          {/* =========================================================
    FLOATING NAVBAR
========================================================= */}

<nav
    className="
        bg-[#FFFDF5]/90
        backdrop-blur-md
        border
        border-[#164A41]/10
        shadow-[0_8px_30px_rgba(22,74,65,0.06)]
        sticky
        top-4
        w-[94%]
        sm:w-[90%]
        lg:w-[82%]
        mx-auto
        rounded-2xl
        z-[90]
    "
>
    <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-7 py-2.5">

        <div className="flex items-center justify-between">

            {/* =================================================
                LOGO
            ================================================= */}

            <button
                onClick={() => {
                    window.location.href = '/';
                }}
                className="
                    flex
                    items-center
                    gap-2
                    hover:opacity-85
                    transition-opacity
                    flex-shrink-0
                "
            >
                {/* <img
                    src="/suzlon-nav.png"
                    alt="Suzlon Logo"
                    className="
                        h-8
                        sm:h-10
                        lg:h-11
                        w-auto
                        object-contain
                    "
                /> */}
                <img
    src={suzlonnav}
    alt="Suzlon Logo"
    className="
        h-8
        sm:h-10
        lg:h-11
        w-auto
        object-contain
    "
/>
            </button>


            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <div className="hidden lg:flex items-center gap-5 xl:gap-9">

                {/* Home */}
                <button
                    onClick={() => {
                        window.location.href = '/';
                    }}
                    className="
                        text-[#164A41]
                        hover:text-[#178C92]
                        font-medium
                        transition-colors
                        text-sm
                        xl:text-base
                    "
                >
                    Home
                </button>


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <div
                    className="relative"
                    ref={productsDropdownRef}
                >
                    <button
                        onClick={() => {
                            setShowProductsDropdown(
                                !showProductsDropdown
                            );
                            setShowPricingDropdown(false);
                        }}
                        className="
                            flex
                            items-center
                            gap-1
                            text-[#164A41]
                            hover:text-[#178C92]
                            font-medium
                            transition-colors
                            text-sm
                            xl:text-base
                        "
                    >
                        Products

                        <ChevronDown
                            className={`
                                w-4
                                h-4
                                transition-transform
                                ${
                                    showProductsDropdown
                                        ? 'rotate-180'
                                        : ''
                                }
                            `}
                        />
                    </button>


                    {showProductsDropdown && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="
                                    fixed
                                    inset-0
                                    bg-[#164A41]/10
                                    backdrop-blur-[2px]
                                    z-[100]
                                "
                                style={{ top: '80px' }}
                                onClick={() =>
                                    setShowProductsDropdown(false)
                                }
                            />


                            {/* Dropdown */}
                            <div
                                className="
                                    fixed
                                    left-1/2
                                    -translate-x-1/2
                                    mt-3
                                    w-[90vw]
                                    max-w-[900px]
                                    bg-[#FFFDF5]
                                    rounded-2xl
                                    shadow-2xl
                                    p-5
                                    sm:p-7
                                    lg:p-8
                                    border
                                    border-[#164A41]/10
                                    z-[110]
                                "
                            >

                                <div className="
                                    grid
                                    grid-cols-1
                                    sm:grid-cols-3
                                    gap-6
                                    lg:gap-10
                                ">

                                    {/* Solutions */}
                                    <div>
                                        <h3 className="
                                            text-base
                                            sm:text-lg
                                            font-bold
                                            text-[#164A41]
                                            mb-4
                                        ">
                                            Solutions
                                        </h3>

                                        <ul className="space-y-3">
                                            {productsData.solutions.map(
                                                (item, idx) => (
                                                    <li key={idx}>
                                                        <button
                                                            onClick={() =>
                                                                handleComingSoon(
                                                                    item
                                                                )
                                                            }
                                                            className="
                                                                text-left
                                                                text-[#49645F]
                                                                hover:text-[#178C92]
                                                                transition-colors
                                                                w-full
                                                                text-sm
                                                                sm:text-base
                                                            "
                                                        >
                                                            {item}
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>


                                    {/* Free Tools */}
                                    <div>
                                        <h3 className="
                                            text-base
                                            sm:text-lg
                                            font-bold
                                            text-[#164A41]
                                            mb-4
                                        ">
                                            Free Tools
                                        </h3>

                                        <ul className="space-y-3">
                                            {productsData.freeTools.map(
                                                (item, idx) => (
                                                    <li key={idx}>
                                                        <button
                                                            onClick={() => {
                                                                if (
                                                                    item.route
                                                                ) {
                                                                    setShowProductsDropdown(
                                                                        false
                                                                    );

                                                                    window.location.href =
                                                                        item.route;
                                                                } else {
                                                                    handleComingSoon(
                                                                        item.name
                                                                    );
                                                                }
                                                            }}
                                                            className="
                                                                text-left
                                                                text-[#49645F]
                                                                hover:text-[#178C92]
                                                                transition-colors
                                                                w-full
                                                                text-sm
                                                                sm:text-base
                                                            "
                                                        >
                                                            {item.name}
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>


                                    {/* Categories */}
                                    <div>
                                        <h3 className="
                                            text-base
                                            sm:text-lg
                                            font-bold
                                            text-[#164A41]
                                            mb-4
                                        ">
                                            Categories
                                        </h3>

                                        <ul className="space-y-3">
                                            {productsData.categories.map(
                                                (item, idx) => (
                                                    <li key={idx}>
                                                        <button
                                                            onClick={() =>
                                                                handleComingSoon(
                                                                    item
                                                                )
                                                            }
                                                            className="
                                                                text-left
                                                                w-full
                                                                text-[#49645F]
                                                                hover:text-[#178C92]
                                                                transition-colors
                                                                text-sm
                                                                sm:text-base
                                                            "
                                                        >
                                                            {item}
                                                        </button>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </>
                    )}
                </div>


                {/* =================================================
                    PRICING
                ================================================= */}

                <div
                    className="relative"
                    ref={pricingDropdownRef}
                >
                    <button
                        onClick={() => {
                            setShowPricingDropdown(
                                !showPricingDropdown
                            );
                            setShowProductsDropdown(false);
                        }}
                        className="
                            flex
                            items-center
                            gap-1
                            text-[#164A41]
                            hover:text-[#178C92]
                            font-medium
                            transition-colors
                            text-sm
                            xl:text-base
                        "
                    >
                        Pricing

                        <ChevronDown
                            className={`
                                w-4
                                h-4
                                transition-transform
                                ${
                                    showPricingDropdown
                                        ? 'rotate-180'
                                        : ''
                                }
                            `}
                        />
                    </button>


                    {showPricingDropdown && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="
                                    fixed
                                    inset-0
                                    bg-[#164A41]/10
                                    backdrop-blur-[2px]
                                    z-[100]
                                "
                                style={{ top: '80px' }}
                                onClick={() =>
                                    setShowPricingDropdown(false)
                                }
                            />


                            {/* Pricing Dropdown */}
                            <div
                                className="
                                    fixed
                                    left-1/2
                                    -translate-x-1/2
                                    mt-3
                                    w-[90vw]
                                    max-w-[600px]
                                    bg-[#FFFDF5]
                                    rounded-2xl
                                    shadow-2xl
                                    p-6
                                    sm:p-8
                                    border
                                    border-[#164A41]/10
                                    z-[110]
                                "
                            >
                                <div className="text-center">

                                    {/* Icon */}
                                    <div
                                        className="
                                            w-14
                                            h-14
                                            sm:w-16
                                            sm:h-16
                                            bg-[#178C92]
                                            rounded-full
                                            flex
                                            items-center
                                            justify-center
                                            mx-auto
                                            mb-4
                                            shadow-lg
                                        "
                                    >
                                        <svg
                                            className="
                                                w-7
                                                h-7
                                                sm:w-8
                                                sm:h-8
                                                text-white
                                            "
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>


                                    <h3 className="
                                        text-xl
                                        sm:text-2xl
                                        font-bold
                                        text-[#164A41]
                                        mb-3
                                    ">
                                        Free for Everyone!
                                    </h3>


                                    <p className="
                                        text-base
                                        sm:text-lg
                                        text-[#49645F]
                                        mb-6
                                    ">
                                        Currently, we are providing
                                        all services{' '}
                                        <span className="
                                            font-semibold
                                            text-[#178C92]
                                        ">
                                            completely free
                                        </span>{' '}
                                        for all users.
                                    </p>


                                    <div className="
                                        bg-[#EAF4F1]
                                        rounded-xl
                                        p-5
                                        sm:p-6
                                        mb-6
                                    ">
                                        <p className="
                                            text-[#49645F]
                                            mb-4
                                            text-sm
                                            sm:text-base
                                        ">
                                            Enjoy unlimited access to:
                                        </p>

                                        <ul className="
                                            space-y-3
                                            text-left
                                            max-w-md
                                            mx-auto
                                        ">
                                            {[
                                                'Invoice Generation',
                                                'Quotation & Purchase Orders',
                                                'GST & Tax Compliance',
                                                'All Premium Features',
                                            ].map(
                                                (feature, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-[#164A41]
                                                            text-sm
                                                            sm:text-base
                                                        "
                                                    >
                                                        <span className="
                                                            w-5
                                                            h-5
                                                            bg-[#178C92]
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                            flex-shrink-0
                                                        ">
                                                            <svg
                                                                className="
                                                                    w-3
                                                                    h-3
                                                                    text-white
                                                                "
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </span>

                                                        {feature}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>


                                    <button
                                        onClick={() => {
                                            setShowPricingDropdown(
                                                false
                                            );

                                            window.location.href =
                                                '/signup';
                                        }}
                                        className="
                                            px-7
                                            sm:px-8
                                            py-3
                                            bg-[#178C92]
                                            hover:bg-[#007078]
                                            text-white
                                            font-semibold
                                            rounded-xl
                                            transition-all
                                            shadow-lg
                                            hover:shadow-xl
                                            text-sm
                                            sm:text-base
                                        "
                                    >
                                        Get Started for Free
                                    </button>

                                </div>
                            </div>
                        </>
                    )}
                </div>


                {/* About Us */}
                <button
                    onClick={() =>
                        window.open(
                            'https://suzlon.com/about',
                            '_blank'
                        )
                    }
                    className="
                        text-[#164A41]
                        hover:text-[#178C92]
                        font-medium
                        transition-colors
                        text-sm
                        xl:text-base
                    "
                >
                    About Us
                </button>


                {/* Contact */}
                <button
                    onClick={() =>
                        window.open(
                            'https://suzlon.com/contact',
                            '_blank'
                        )
                    }
                    className="
                        text-[#164A41]
                        hover:text-[#178C92]
                        font-medium
                        transition-colors
                        text-sm
                        xl:text-base
                    "
                >
                    Contact
                </button>

            </div>


            {/* =================================================
                DESKTOP AUTH
            ================================================= */}

            <div className="
                hidden
                lg:flex
                items-center
                gap-4
                xl:gap-7
            ">

                <button
                    onClick={() => {
                        window.location.href = '/login';
                    }}
                    className="
                        text-[#164A41]
                        hover:text-[#178C92]
                        font-medium
                        transition-colors
                        text-sm
                        xl:text-base
                    "
                >
                    Login
                </button>


                <button
                    onClick={() => {
                        window.location.href = '/signup';
                    }}
                    className="
                        px-4
                        sm:px-5
                        py-2.5
                        bg-[#178C92]
                        hover:bg-[#007078]
                        text-white
                        font-semibold
                        rounded-xl
                        transition-all
                        shadow-sm
                        hover:shadow-md
                        text-sm
                        xl:text-base
                    "
                >
                    Sign Up
                </button>

            </div>


            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
                onClick={() =>
                    setShowMobileMenu(!showMobileMenu)
                }
                className="
                    lg:hidden
                    p-2
                    text-[#164A41]
                    hover:text-[#178C92]
                    transition-colors
                "
            >
                {showMobileMenu ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>

        </div>


        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {showMobileMenu && (
            <div
                className="
                    lg:hidden
                    mt-4
                    pb-5
                    border-t
                    border-[#164A41]/10
                    pt-4
                "
            >
                <div className="flex flex-col gap-3">

                    {/* Home */}
                    <button
                        onClick={() => {
                            setShowMobileMenu(false);
                            window.location.href = '/';
                        }}
                        className="
                            text-left
                            px-3
                            py-2
                            text-[#164A41]
                            hover:text-[#178C92]
                            font-medium
                            rounded-lg
                            hover:bg-[#EAF4F1]
                            transition-colors
                        "
                    >
                        Home
                    </button>


                    {/* Products */}
                    <button
                        onClick={() =>
                            setShowProductsDropdown(
                                !showProductsDropdown
                            )
                        }
                        className="
                            flex
                            items-center
                            justify-between
                            px-3
                            py-2
                            text-[#164A41]
                            hover:text-[#178C92]
                            font-medium
                            rounded-lg
                            hover:bg-[#EAF4F1]
                            transition-colors
                        "
                    >
                        Products

                        <ChevronDown
                            className={`
                                w-4
                                h-4
                                transition-transform
                                ${
                                    showProductsDropdown
                                        ? 'rotate-180'
                                        : ''
                                }
                            `}
                        />
                    </button>


                    {showProductsDropdown && (
                        <div className="
                            ml-3
                            pl-4
                            border-l-2
                            border-[#178C92]/20
                            space-y-1
                            text-sm
                        ">
                            {productsData.freeTools
                                .filter((item) => item.route)
                                .map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setShowProductsDropdown(
                                                false
                                            );
                                            setShowMobileMenu(
                                                false
                                            );

                                            window.location.href =
                                                item.route!;
                                        }}
                                        className="
                                            block
                                            w-full
                                            text-left
                                            px-3
                                            py-2
                                            text-[#49645F]
                                            hover:text-[#178C92]
                                            hover:bg-[#EAF4F1]
                                            rounded-lg
                                            transition-colors
                                        "
                                    >
                                        {item.name}
                                    </button>
                                ))}
                        </div>
                    )}


                    {/* Pricing */}
                    <button
                        onClick={() =>
                            setShowPricingDropdown(
                                !showPricingDropdown
                            )
                        }
                        className="
                            flex
                            items-center
                            justify-between
                            px-3
                            py-2
                            text-[#164A41]
                            hover:text-[#178C92]
                            font-medium
                            rounded-lg
                            hover:bg-[#EAF4F1]
                            transition-colors
                        "
                    >
                        Pricing

                        <ChevronDown
                            className={`
                                w-4
                                h-4
                                transition-transform
                                ${
                                    showPricingDropdown
                                        ? 'rotate-180'
                                        : ''
                                }
                            `}
                        />
                    </button>


                    {showPricingDropdown && (
                        <div className="
                            ml-3
                            bg-[#EAF4F1]
                            rounded-xl
                            p-4
                            space-y-3
                        ">
                            <p className="
                                text-[#164A41]
                                font-semibold
                            ">
                                Free for Everyone!
                            </p>

                            <p className="
                                text-[#49645F]
                                text-sm
                            ">
                                All services are currently{' '}
                                <span className="
                                    font-semibold
                                    text-[#178C92]
                                ">
                                    completely free
                                </span>
                                .
                            </p>

                            <button
                                onClick={() => {
                                    setShowPricingDropdown(false);
                                    setShowMobileMenu(false);
                                    window.location.href =
                                        '/signup';
                                }}
                                className="
                                    w-full
                                    py-2.5
                                    bg-[#178C92]
                                    hover:bg-[#007078]
                                    text-white
                                    font-semibold
                                    rounded-xl
                                    transition-colors
                                "
                            >
                                Get Started for Free
                            </button>
                        </div>
                    )}


                    {/* About Us */}
                    <button
                        onClick={() => {
                            setShowMobileMenu(false);
                            window.open(
                                'https://suzlon.com/about',
                                '_blank'
                            );
                        }}
                        className="
                            text-left
                            px-3
                            py-2
                            text-[#164A41]
                            hover:text-[#178C92]
                            font-medium
                            rounded-lg
                            hover:bg-[#EAF4F1]
                            transition-colors
                        "
                    >
                        About Us
                    </button>


                    {/* Contact */}
                    <button
                        onClick={() => {
                            setShowMobileMenu(false);
                            window.open(
                                'https://suzlon.com/contact',
                                '_blank'
                            );
                        }}
                        className="
                            text-left
                            px-3
                            py-2
                            text-[#164A41]
                            hover:text-[#178C92]
                            font-medium
                            rounded-lg
                            hover:bg-[#EAF4F1]
                            transition-colors
                        "
                    >
                        Contact
                    </button>


                    {/* Mobile Auth */}
                    <div className="
                        pt-4
                        mt-2
                        border-t
                        border-[#164A41]/10
                        flex
                        gap-3
                    ">

                        <a
                            href="/login"
                            className="
                                flex-1
                                py-2.5
                                text-center
                                text-[#164A41]
                                font-medium
                                border
                                border-[#164A41]/20
                                rounded-xl
                                hover:bg-[#EAF4F1]
                                transition-colors
                                text-sm
                            "
                        >
                            Login
                        </a>

                        <a
                            href="/signup"
                            className="
                                flex-1
                                py-2.5
                                text-center
                                bg-[#178C92]
                                text-white
                                font-semibold
                                rounded-xl
                                hover:bg-[#007078]
                                transition-colors
                                text-sm
                            "
                        >
                            Sign Up
                        </a>

                    </div>

                </div>
            </div>
        )}

    </div>
</nav>



            {/* Coming Soon Modal */}
            {showComingSoonModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-slideUp">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowComingSoonModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#178C92] to-[#0f6368] rounded-full flex items-center justify-center animate-pulse">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1">
                                    <Bell className="w-6 h-6 text-yellow-400 animate-bounce" />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
                            Coming Soon!
                        </h3>

                        {/* Feature Name */}
                        <div className="bg-gradient-to-r from-[#e6f7f8] to-blue-50 rounded-xl p-4 mb-4">
                            <p className="text-center text-[#178C92] font-semibold text-lg">
                                {comingSoonFeature}
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-center text-gray-600 mb-6">
                            We're working hard to bring you this amazing feature. Stay tuned for updates!
                        </p>

                        {/* Notify Me Section */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-700 text-center mb-3">
                                Want to be notified when this feature launches?
                            </p>
                            <button
                                onClick={() => {
                                    setShowComingSoonModal(false);
                                    window.location.href = '/signup';
                                }}
                                className="w-full bg-gradient-to-r from-[#178C92] to-[#1aa3aa] hover:from-[#0f6368] hover:to-[#0f6368] text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Notify Me
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setShowComingSoonModal(false)}
                            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default LandingNavbar;


