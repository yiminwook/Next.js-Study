import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react';

export default function Gnb() {
  const [activeItem, setActiveItem] = useState("home");
  const router = useRouter();

  function goLink(e: any, data: any) {
    setActiveItem(data.name);
    if (data.name === "home") {
      router.push("/");
    } else if (data.name === "About") {
      router.push("/about");
    } else if (data.name === "Contact Us") {
      router.push("/contact");
    } else if (data.name === "Admin") {
      router.push("/admin");
    }
  }

  return (
    <Menu inverted>
    <Menu.Item
      name='home'
      active={activeItem === 'home'}
      onClick={goLink}
    />
    <Menu.Item
      name='About'
      active={activeItem === 'About'}
      onClick={goLink}
    />
    <Menu.Item
      name='Contact Us'
      active={activeItem === 'Contact Us'}
      onClick={goLink}
    />
    <Menu.Item
      name='Admin'
      active={activeItem === 'Admin'}
      onClick={goLink}
    />
  </Menu>
  )
}