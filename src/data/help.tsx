// Contenido del centro de ayuda ("Servicio de asistencia rápida").
// Texto entregado por la tienda; editar aquí para actualizar políticas.
import { site } from "@/config/site";

export type HelpQuestion = { q: string; a: React.ReactNode };
export type HelpSection = { slug: string; title: string; questions: HelpQuestion[] };

const wa = `https://wa.me/${site.whatsapp}`;
const WhatsAppLink = ({ children = "nuestra línea de WhatsApp" }: { children?: React.ReactNode }) => (
  <a href={wa} target="_blank" rel="noreferrer">
    {children}
  </a>
);

export const helpSections: HelpSection[] = [
  {
    slug: "envios",
    title: "Envío y entrega",
    questions: [
      {
        q: "¿Cuánto tardará en llegar mi pedido?",
        a: (
          <p>
            Una vez que tu pago haya sido confirmado y nuestro almacén termine la preparación de tu pedido, recibirás la confirmación con
            tu número de guía de seguimiento. A partir de ese momento realizaremos la entrega en la dirección registrada en la orden en un
            estimado de {site.shipping.eta}.
          </p>
        ),
      },
      {
        q: `¿Cómo puedo obtener envío gratis en los pedidos de ${site.name}?`,
        a: (
          <>
            <p>El envío es gratis a toda Colombia en todos los pedidos: el precio de cada perfume ya lo incluye.</p>
            <p>No necesitas un monto mínimo ni un código; el beneficio se aplica automáticamente en el carrito de compras.</p>
            <p className="text-sm text-stone">Esta condición está sujeta a cambios. En cualquier caso, te avisaremos si cambia.</p>
          </>
        ),
      },
      {
        q: "¿Dónde puedo encontrar la fecha de entrega?",
        a: (
          <p>
            Puedes comprobar el estado de tu pedido y hacerle seguimiento con la guía que te proporcionamos. Además, al momento de realizar la
            compra se indica el periodo en el cual será entregado.
          </p>
        ),
      },
      {
        q: "¿Por qué mi pedido está retrasado?",
        a: (
          <p>
            Hacemos todo lo posible por entregar tu pedido a tiempo, pero en ocasiones, por circunstancias ajenas a la compañía, puede tomar
            un poco más. Una vez enviado, tu paquete podría retrasarse por condiciones climáticas adversas, una dirección de entrega
            incompleta o retrasos del servicio regional.
          </p>
        ),
      },
      {
        q: "¿Qué debo hacer si mi pedido aparece como entregado, pero no lo he recibido?",
        a: (
          <p>
            A veces la información de seguimiento del transportista se actualiza antes de tiempo, por lo que tu paquete podría entregarse en
            un plazo de 24 horas. Si todavía no es la fecha estimada, ten paciencia: tu paquete está en camino. Si ya pasó la fecha estimada,
            puedes comunicarte con nosotros para obtener ayuda en <WhatsAppLink>la línea de servicio al cliente</WhatsAppLink>.
          </p>
        ),
      },
    ],
  },
  {
    slug: "pedidos",
    title: "Pedidos",
    questions: [
      {
        q: "¿Dónde está mi pedido?",
        a: (
          <>
            <p>Recuerda que puedes realizar el seguimiento de tu pedido.</p>
            <p>
              Una vez despachado tu pedido, recibirás una guía con un código de rastreo. Puedes copiar y pegar ese código en el sitio web de
              la transportadora.
            </p>
            <p className="text-sm text-stone">
              Debes esperar a que nuestro almacén prepare tu pedido para poder ver la guía de envío y validar el estado de tu entrega en el
              sitio de nuestros socios logísticos.
            </p>
          </>
        ),
      },
      {
        q: "¿Dónde puedo encontrar el número de seguimiento?",
        a: <p>Cuando se envíe tu pedido, te enviaremos una guía con el número de seguimiento del transportista.</p>,
      },
      {
        q: "¿Por qué la información de seguimiento no se ha actualizado?",
        a: (
          <p>
            No te preocupes si la información de seguimiento no aparece de inmediato: al transportista puede tomarle hasta 48 horas
            activarla. Vuelve a consultar, se actualizará pronto.
          </p>
        ),
      },
      {
        q: "¿Puedo cambiar la dirección de entrega de mi pedido?",
        a: (
          <p>
            No. Nuestro equipo se apresura en procesar y enviar tu pedido lo antes posible, por eso no podemos cambiar el pedido ni la
            dirección de entrega.
          </p>
        ),
      },
    ],
  },
  {
    slug: "originalidad",
    title: "Originalidad y producto",
    questions: [
      {
        q: "¿Los perfumes son originales?",
        a: (
          <>
            <p>
              Sí. Todos los perfumes de {site.name} son 100% originales, nuevos y sellados de fábrica. No vendemos réplicas, imitaciones,
              decants ni perfumes “inspirados en”.
            </p>
            <p>Cada frasco llega en su caja original con el sello (celofán) intacto.</p>
          </>
        ),
      },
      {
        q: "¿Cómo puedo verificar que mi perfume es original?",
        a: (
          <>
            <p>Al recibir tu pedido revisa que:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>La caja llegue sellada y sin señales de haber sido abierta.</li>
              <li>El código de lote impreso en la base de la caja coincida con el del frasco.</li>
              <li>El atomizador funcione bien y el líquido no tenga sedimentos.</li>
            </ul>
            <p>
              Si tienes cualquier duda, escríbenos a <WhatsAppLink /> antes de abrir el producto y te ayudamos.
            </p>
          </>
        ),
      },
      {
        q: "¿Qué diferencia hay entre Parfum, Eau de Parfum y Eau de Toilette?",
        a: (
          <>
            <p>La diferencia está en la concentración de esencia, que influye en la intensidad y la duración:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <span className="font-medium">Parfum / Extrait:</span> la más concentrada; muy intensa y duradera.
              </li>
              <li>
                <span className="font-medium">Eau de Parfum (EDP):</span> intensa y de larga duración; la más usada a diario.
              </li>
              <li>
                <span className="font-medium">Eau de Toilette (EDT):</span> más ligera y fresca; ideal para el día y climas cálidos.
              </li>
            </ul>
            <p className="text-sm text-stone">La duración también depende del tipo de piel, el clima y dónde se aplique.</p>
          </>
        ),
      },
      {
        q: "¿Cómo debo conservar mi perfume?",
        a: (
          <p>
            Guárdalo en su caja, en un lugar fresco y seco, lejos de la luz directa del sol y de cambios bruscos de temperatura (evita el baño
            y el carro). Así conservará su aroma por mucho más tiempo.
          </p>
        ),
      },
    ],
  },
  {
    slug: "devoluciones",
    title: "Garantías y devoluciones",
    questions: [
      {
        q: "Garantía de los productos",
        a: (
          <>
            <p>
              Si tu perfume llega con un defecto de fábrica (por ejemplo, el atomizador no funciona, el frasco gotea o llegó roto),
              queremos solucionarlo cuanto antes. Nos hacemos responsables de la garantía legal de todos nuestros productos.
            </p>
            <p>
              Si tu producto presenta defectos o fallas y han pasado menos de quince (15) días calendario desde que recibiste tu compra en
              {` ${site.name}`}, solo tienes que devolverlo con nuestros aliados logísticos autorizados para realizar el proceso de
              verificación en virtud de la garantía legal.
            </p>
            <p>Solo tienes que seguir los pasos indicados a continuación para devolver tu pedido:</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>
                Envíanos fotos o un video del perfume y su caja a <WhatsAppLink /> para verificar el artículo. Si no cumple los requisitos de devolución,
                te los enviamos de nuevo a la dirección que proporcionaste.
              </li>
              <li>Si la devolución es aprobada, te solicitaremos tu información y datos para realizarla.</li>
              <li>Empaca el artículo de forma segura y adjunta la etiqueta de devolución (número de guía).</li>
              <li>Lleva el paquete a la transportadora aliada autorizada más cercana con la etiqueta impresa o visible en tu celular.</li>
            </ol>
            <p className="font-medium">
              En ningún caso y bajo ningún motivo {site.name} se hará responsable por la garantía legal en los siguientes casos:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Fuerza mayor o caso fortuito.</li>
              <li>El hecho de un tercero.</li>
              <li>El uso indebido del producto por parte del consumidor.</li>
              <li>Que el consumidor no haya atendido las instrucciones de uso y conservación.</li>
              <li>Cambios de aroma causados por exposición al sol, al calor o a temperaturas extremas después de la entrega.</li>
              <li>Preferencias personales sobre el aroma una vez abierto el producto.</li>
            </ul>
          </>
        ),
      },
      {
        q: "¿Puedo devolver un perfume que ya abrí?",
        a: (
          <>
            <p>
              Por higiene y para garantizar que todos nuestros perfumes lleguen sellados, solo aceptamos devoluciones de productos que no
              hayan sido abiertos ni usados, con el sello de la caja intacto.
            </p>
            <p>
              Si el perfume tiene un defecto de fábrica, tienes hasta quince (15) días calendario a partir de la fecha de entrega para hacer
              efectiva la garantía legal, aunque lo hayas abierto.
            </p>
          </>
        ),
      },
    ],
  },
  {
    slug: "pagos",
    title: "Opciones de pago",
    questions: [
      {
        q: "¿Qué medios de pago aceptan?",
        a: (
          <p>
            Pagas de forma segura a través de Wompi con tarjeta de crédito o débito, PSE o Nequi. El pago se confirma en línea y te avisamos
            en cuanto tu pedido quede aprobado.
          </p>
        ),
      },
    ],
  },
];
