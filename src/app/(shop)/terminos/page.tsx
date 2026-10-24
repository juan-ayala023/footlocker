import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de compra de FootLockerCol: productos, precios, envíos, cambios, garantía, retracto y datos personales.",
  alternates: { canonical: "/terminos" },
};

// Texto entregado por la tienda. Cada sección es una lista de párrafos; `list` va como viñetas.
const UPDATED = "23 de octubre de 2026";

type Section = { title: string; paragraphs?: string[]; list?: string[]; after?: string[] };

const SECTIONS: Section[] = [
  {
    title: "Información de la tienda",
    list: [
      "Nombre comercial: FootLockerCol",
      "Dirección para notificaciones: Rionegro, Antioquia, Colombia",
      "Ciudad: Rionegro, Antioquia, Colombia",
      "Teléfono y WhatsApp: 311-333-7845",
      "Instagram: @footlockercol",
      "Canales oficiales de atención: Instagram @footlockercol, WhatsApp 311-333-7845",
    ],
  },
  {
    title: "Descripción de los productos",
    paragraphs: [
      "Nuestra tienda ofrece sneakers y calzado urbano de diferentes estilos, diseños y características.",
      "Los productos ofrecidos por la tienda son réplicas y no corresponden necesariamente a productos originales, oficiales o autorizados por las marcas cuyos diseños, referencias o elementos visuales puedan representar. Esta información se comunica de manera clara para evitar confusiones sobre su autenticidad, fabricante, procedencia o autorización comercial.",
      "Cada producto deberá describirse de manera clara, veraz y suficiente, incluyendo materiales, colores, tallas, características relevantes y condición comercial.",
      "No se afirmará que un producto es original, autorizado o fabricado por una marca determinada si esto no puede acreditarse. La comercialización de productos que utilicen marcas, logotipos o signos distintivos de terceros puede estar sujeta a restricciones legales aplicables en Colombia. La identificación de un producto como réplica no elimina las posibles responsabilidades derivadas del uso no autorizado de marcas o signos distintivos.",
    ],
  },
  {
    title: "Precios, impuestos y pagos",
    paragraphs: [
      "Los precios se expresarán en pesos colombianos (COP). Antes de confirmar la compra, se informará el precio total, incluidos los costos de envío, impuestos, recargos u otros cargos aplicables.",
      "Los medios de pago disponibles se comunicarán a través de nuestros canales oficiales. La compra se considerará confirmada cuando el pago haya sido aprobado o cuando la tienda confirme expresamente el pedido.",
      "La tienda no solicitará claves, códigos de seguridad ni información confidencial de tarjetas a través de redes sociales o canales no autorizados.",
    ],
  },
  {
    title: "Disponibilidad y pedidos",
    paragraphs: [
      "Los pedidos estarán sujetos a la disponibilidad de tallas, colores y referencias. El cliente recibirá información sobre el estado de su pedido y los plazos de entrega previstos.",
      "Si un producto no está disponible después de confirmada la compra, se informará al cliente y se procederá conforme a sus derechos legales, incluyendo, cuando corresponda, la devolución de las sumas pagadas.",
      "La tienda podrá cancelar un pedido cuando exista un error manifiesto en el precio, una imposibilidad de entrega o una circunstancia que impida legalmente su comercialización. En estos casos, se informará al cliente y se devolverán los pagos recibidos cuando corresponda.",
    ],
  },
  {
    title: "Envíos",
    paragraphs: [
      "El costo y el plazo estimado de entrega se comunicarán antes de finalizar la compra. Los plazos podrán variar según la ciudad de destino, la disponibilidad del producto y las condiciones de la empresa transportadora.",
      "El cliente deberá suministrar correctamente los datos necesarios para el envío. Si ocurre una novedad logística, se informarán las alternativas disponibles, sin limitar los derechos del consumidor.",
      "La entrega se realizará en la dirección indicada por el cliente o mediante el mecanismo acordado. Si el pedido no puede entregarse por información incorrecta, ausencia reiterada o imposibilidad atribuible al cliente, se informarán las opciones disponibles y los costos adicionales que legalmente correspondan.",
    ],
  },
  {
    title: "Cambios de talla y referencia",
    paragraphs: [
      "Las solicitudes de cambios voluntarios se tramitarán a través de los canales oficiales y estarán sujetas a la disponibilidad del producto y a las condiciones informadas antes de la compra.",
      "Salvo que se indique lo contrario, el producto deberá devolverse sin uso, limpio, completo, con su empaque y en condiciones que permitan su comercialización. Estas condiciones no se aplicarán de manera que restrinjan la garantía legal o el derecho de retracto cuando resulten aplicables.",
      "Los costos de transporte asociados a un cambio voluntario se informarán previamente. Si el cambio se debe a un defecto, error de despacho o incumplimiento de la tienda, se aplicarán las reglas de garantía o solución legal correspondientes.",
    ],
  },
  {
    title: "Garantía legal",
    paragraphs: [
      "Los productos contarán con la garantía legal aplicable en Colombia.",
      "Cuando exista un posible defecto de calidad o idoneidad, el cliente podrá presentar una reclamación mediante los canales de atención, indicando el número de pedido, una descripción del problema y, cuando sea posible, fotografías o videos del producto.",
      "La solicitud se evaluará de acuerdo con la legislación vigente y la solución que legalmente corresponda. La garantía no cubrirá daños derivados del uso inadecuado, desgaste normal, modificaciones, reparaciones no autorizadas o incumplimiento de las instrucciones de cuidado, sin perjuicio de los derechos que correspondan al consumidor.",
    ],
  },
  {
    title: "Retracto y devoluciones",
    paragraphs: [
      "En las compras a distancia, el consumidor podrá ejercer el derecho de retracto cuando resulte aplicable, dentro de los plazos y bajo las condiciones previstas en la legislación colombiana.",
      "Las devoluciones por retracto, las reclamaciones de garantía y los cambios voluntarios son procedimientos distintos y se gestionarán conforme a sus respectivas reglas legales.",
      "Cuando corresponda una devolución de dinero, esta se realizará mediante el mismo medio de pago utilizado o mediante otro mecanismo acordado con el cliente, dentro de los plazos legalmente aplicables.",
    ],
  },
  {
    title: "Información veraz sobre marcas y procedencia",
    paragraphs: [
      "La tienda identificará los productos de forma que no induzcan a error sobre su fabricante, marca, autenticidad, procedencia o autorización comercial.",
      "Los productos se presentarán expresamente como réplicas y no como productos originales. No se presentarán productos genéricos o réplicas como originales ni se afirmará que cuentan con autorización de una marca determinada si esto no puede acreditarse.",
      "La utilización de marcas, logotipos o signos distintivos de terceros puede infringir derechos de propiedad industrial y estar sujeta a las consecuencias legales correspondientes. Esta cláusula no constituye una autorización para utilizar marcas ajenas ni elimina las obligaciones legales de la tienda.",
    ],
  },
  {
    title: "Protección de datos personales",
    paragraphs: [
      "Los datos personales se tratarán conforme a la normativa colombiana aplicable y a la política de tratamiento de datos de la tienda.",
      "Se utilizarán para gestionar compras, pagos, entregas, garantías y atención al cliente, así como para otras finalidades debidamente informadas y autorizadas cuando corresponda.",
      "El cliente podrá solicitar la consulta, actualización, corrección o eliminación de sus datos, cuando legalmente proceda, mediante los canales oficiales de atención.",
    ],
  },
  {
    title: "Lectura y aceptación de la información",
    paragraphs: [
      "El cliente declara que ha tenido la oportunidad de leer, comprender y consultar la información suministrada en estos términos y condiciones antes de realizar una compra.",
      "La tienda no se hace responsable de la falta de lectura, revisión o comprensión de la información publicada por parte del cliente. No obstante, esta disposición no limita los derechos irrenunciables del consumidor ni exime a la tienda de suministrar información clara, veraz, suficiente y oportuna conforme a la legislación aplicable.",
      "La aceptación de estos términos no implica que el cliente renuncie a derechos reconocidos por la ley.",
    ],
  },
  {
    title: "Atención al cliente y reclamaciones",
    paragraphs: ["Los clientes podrán presentar consultas, solicitudes y reclamaciones mediante los canales oficiales publicados por la tienda:"],
    list: [
      "Teléfono y WhatsApp: 311-333-7845",
      "Instagram: @footlockercol",
      "Dirección para notificaciones: Rionegro, Antioquia, Colombia",
    ],
    after: [
      "Las solicitudes se atenderán dentro de los plazos legales aplicables. Para facilitar la gestión, el cliente deberá indicar su nombre, número de pedido, datos de contacto y una descripción clara de la solicitud.",
    ],
  },
  {
    title: "Propiedad intelectual y contenido de la tienda",
    paragraphs: [
      "Los textos, fotografías, diseños, logotipos, nombres comerciales y demás contenidos propios publicados por la tienda pertenecen a su titular o se utilizan con autorización.",
      "El cliente no podrá copiar, reproducir, modificar, distribuir o utilizar dichos contenidos con fines comerciales sin autorización previa, salvo que la ley permita expresamente lo contrario.",
      "La tienda no reclama derechos sobre marcas, logotipos o elementos distintivos pertenecientes a terceros. Su uso, cuando exista, no debe interpretarse como una afirmación de autorización, afiliación o patrocinio.",
    ],
  },
  {
    title: "Prevención de fraude y seguridad",
    paragraphs: [
      "Las compras deberán realizarse únicamente a través de los canales oficiales de la tienda. La tienda no será responsable por pagos realizados a cuentas, perfiles o números que no hayan sido confirmados mediante sus canales oficiales, sin perjuicio de las obligaciones legales que correspondan.",
      "El cliente deberá verificar que la información del destinatario y del pedido sea correcta antes de confirmar la compra.",
    ],
  },
  {
    title: "Legislación aplicable",
    paragraphs: [
      "Estos términos se interpretarán conforme a las leyes de la República de Colombia, incluidas las normas de protección al consumidor, comercio electrónico, protección de datos y propiedad industrial.",
      "Si alguna disposición resulta inválida o inaplicable, las demás disposiciones continuarán vigentes en la medida permitida por la ley.",
    ],
  },
];

const Paragraphs = ({ items }: { items?: string[] }) => <>{items?.map((p) => <p key={p}>{p}</p>)}</>;

export default function TermsPage() {
  return (
    <div className="theme-light bg-ink text-bone">
      <div className="container-page max-w-3xl pt-[calc(var(--nav-h)+2.5rem)] pb-24 md:pt-[calc(var(--nav-h)+4rem)]">
        <h1 className="font-sans text-[2rem] leading-tight font-normal tracking-wide uppercase md:text-5xl">Términos y condiciones</h1>
        <p className="mt-4 text-mist">Última actualización: {UPDATED}</p>

        <ol className="mt-12 space-y-12">
          {SECTIONS.map((s, i) => (
            <li key={s.title} className="border-t border-line pt-8">
              <h2 className="text-xl font-bold md:text-2xl">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-mist">
                <Paragraphs items={s.paragraphs} />
                {s.list && (
                  <ul className="list-disc space-y-1 pl-5">
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <Paragraphs items={s.after} />
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-16 font-display text-2xl font-bold">FOOTLOCKER — Believe in yourself.</p>
      </div>
    </div>
  );
}
