import { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import SidebarLogo from './Logo'
import Navmenu from './Navmenu'
import { menuNormal, menuItems, menuLectura } from '@/constant/data'
import useSemiDark from '@/hooks/useSemiDark'
import useSidebar from '@/hooks/useSidebar'
import useSkin from '@/hooks/useSkin'

const Sidebar = () => {
  const scrollableNodeRef = useRef()
  const [scroll, setScroll] = useState(false)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true)
      } else {
        setScroll(false)
      }
    }
    scrollableNodeRef.current.addEventListener('scroll', handleScroll)
  }, [scrollableNodeRef])

  const [collapsed] = useSidebar()
  const [menuHover, setMenuHover] = useState(false)
  const [isSemiDark] = useSemiDark()
  const [skin] = useSkin()

  let selectedMenu = menuNormal
  if (user.roles_id === 1) selectedMenu = menuItems
  else if (user.roles_id === 5) selectedMenu = menuLectura

  return (
    <div className={isSemiDark ? 'dark' : ''}>
      <div
        className={`sidebar-wrapper bg-white dark:bg-slate-800 ${
          collapsed ? 'w-[72px] close_sidebar' : 'w-[248px]'
        } ${menuHover ? 'sidebar-hovered' : ''} ${
          skin === 'bordered' ? 'border-r border-slate-200 dark:border-slate-700' : 'shadow-base'
        }`}
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
      >
        <SidebarLogo menuHover={menuHover} />
        <div
          className={`h-[60px] absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
            scroll ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <SimpleBar className='sidebar-menu px-4 h-[calc(100%-80px)]' scrollableNodeProps={{ ref: scrollableNodeRef }}>
          <Navmenu menus={selectedMenu} />
        </SimpleBar>
      </div>
    </div>
  )
}

export default Sidebar
